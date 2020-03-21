import requests
import re
from bs4 import BeautifulSoup
from word2number import w2n
import time
import os
import json
from pymongo import MongoClient
import dns # required for connecting with SRV

BASE_URL = 'http://outbreaks.globalincidentmap.com/eventdetail.php?ID='
LOWEST_RECORD_NUMBER = 37
INDEX_FILE = "last_record_scraped.txt"

DISEASE_TRANSLATIONS = {
    "Avian Flu": "influenza a/h5n1",
    "Botulism": "botulism",
    "Brucellosis": "brucellosis",
    "Chikungunya": "chikungunya",
    "Cholera Outbreak": "cholera",
    "Congo Fever": "crimean-congo haemorrhagic fever",
    "Coronavirus": "COVID-19",
    "Dengue / Hemorrhagic Fever": "dengue",
    "Foot-And-Mouth Disease": "hand, foot and mouth disease",
    "H3N2 - Swine Flu / Canine Influenza": "influenza a/h3n2",
    "Hantavirus": "hantavirus",
    "Lassa Fever": "lassa fever",
    "Malaria": "malaria",
    "Monkey Pox": "monkeypox",
    "Nipah Virus": "nipah virus",
    "Plague": "plague",
    "Polio": "poliomyelitis",
    "Q-Fever": "q fever",
    "Rabies": "rabies",
    "Rift Valley Fever": "rift valley fever",
    "Salmonella Outbreak (Suspected or Confirmed)": "salmonellosis",
    "Small Pox": "smallpox",
    "Swine Flu - Confirmed / Possible Related Death": "influenza a/h1n1",
    "Swine Flu - Confirmed Cases": "influenza a/h1n1",
    "Swine Flu - Suspected or Probable Cases": "influenza a/h1n1",
    "Tularemia": "tularemia",
    "West Nile Virus (suspected or confirmed)": "west nile virus",
    "Zika": "zika",

    "Schmallenberg Virus": "other",#"schmallenberg virus",
    "Newcastle Disease": "other",#"virulent newcastle disease",
    "Miscellaneous / Unknown Diseases or Illnesses": "unknown",
}

SYNDROME_TRANSLATIONS = {
    "Meningitis Outbreak ( Suspected or Confirmed)": "Meningitis",
    "Encephalitis": "Encephalitis",
}

"""
Uncategorised yet
    "Anthrax": "", #"anthrax cutaneous" "anthrax gastrointestinous" "anthrax inhalation"
    "General News": "", # not actually that general...
"""


IGNORED_EVENTS = [
    "Vaccines",
    "Biological Incidents/ Threats/ Anthrax Hoaxes etc",
    "Notable H1N1 News And Announcements",
    "Suspicious or Threatening Powder",

    "African Swine Fever / Swine Fever", # not in humans
    "Glanders", # not in the supported list # animal thing
    "Hendra Virus", # not in the supported list # horse thing
    "KCP", # not in the supported list # wtf is this anyway
    "NDM-1", # not a disease
    "Ricin", # a poison
    "Rathayibacter ", # a bacteria
    "Classical Swine Fever",
    "Typhoid / Typhus", # maybe salmonella?
]


ALLOWED_INFLUENZA = {
    "influenza a/h5n1",
    "influenza a/h7n9",
    "influenza a/h9n2",
    "influenza a/h1n1",
    "influenza a/h1n2",
    "influenza a/h3n5",
    "influenza a/h3n2",
    "influenza a/h2n2",
}

if (not os.path.exists(INDEX_FILE)):
    print("{} does not exist. Creating one...".format(INDEX_FILE))
    index_file = open("last_record_scraped.txt", "w")
    index_file.write(str(LOWEST_RECORD_NUMBER - 1)) # We want to scrape that record at some point
    index_file.close()

index_file = open(INDEX_FILE, "r")
latest_index = int(index_file.readline()) # Keep track of what we have successfully read. Write this number to file 
index_file.close()

starting_index = latest_index + 1 # Start from the record we couldn't read last time
ending_index = starting_index + 10000
dead_count = 0
dead_threshold = 20


# MongoDB stuff
client = MongoClient('mongodb+srv://admin:admin@cluster0-zhnwq.gcp.mongodb.net/test?retryWrites=true&w=majority')
db = client["disease_reports"]["beta"]

# removes white space and unicode characters
def clean(string):
    string = re.sub(r'\r', r'', string)
    string = re.sub(r'\n\n', r'\n', string)
    string = re.sub(r'\n\n', r'\n', string)
    string = re.sub(r'\[.*?[:-]+ *', r' ', string)
    string = re.sub(r'\[.*?\] *', r' ', string)
    string = re.sub(r'^\.', r'', string)
    string = re.sub(r'\"', r'', string)
    string = re.sub(r'\'', r'', string)
    string.replace('  ', ' ')
    string.replace('  ', ' ')
    return string.strip().encode('ascii', 'ignore').decode('ascii')

print("Scraping records from {} to {}".format(starting_index, ending_index))
for i in range(starting_index, ending_index, 1):
    if (dead_count >= dead_threshold):
        print("{} records in a row have been empty. Stopping now".format(dead_threshold))
        break

    time.sleep(4)
    print("")
    print(BASE_URL + str(i))
    event_page = requests.get(BASE_URL + str(i))
    event_soup = BeautifulSoup(event_page.text, 'html.parser')

    details = event_soup.find_all('td', {'class': 'tdline'})

    event_type = clean(details[1].text)
    date = clean(details[3].text)
    country = clean(details[5].text)
    city = clean(details[7].text)
    latitude = clean(details[9].text)
    longitude = clean(details[11].text)
    url = clean(details[13].text)

    # if there is no data then just continue
    if (url == ""):
        dead_count = dead_count + 1
        print("Found no content for record {}".format(i))
        continue
    dead_count = 0 # there was content. reset the counter

    description = clean(event_soup.find_all('tr', {'class': 'tdtext'})[0].text)
    if (len(description) > 1000):
        print("Ignoring id {} description too long".format(i))
        continue

    if ("GlobalIncidentMap.com" in description):
        print("Ignoring id {} since it has been update".format(i))
        continue

    diseases = []
    syndromes = []

    # Find the actual subtype mentioned
    if (event_type == "H7N9 / H5N1 / H5N2 / H7N1 / H7N3 / H7N7 / H5N8"):
        try:
            article = requests.get(url, timeout=10)
        except Exception as e:
            print("Error while requesting the article\nurl={}".format(url))
            print(e)
            article = requests.Response()

        influenzas = ["influenza a/" + x.lower() for x in re.findall(r'H\dN\d', description + article.text, re.IGNORECASE)]
        diseases = list(ALLOWED_INFLUENZA.intersection(influenzas))
        if (len(diseases) == 0):
            # If we are still struggling to identify which influenza
            # do a crappy keyword search
            swine = re.findall(r'swine', description + article.text, re.IGNORECASE)
            avian = re.findall(r'avian', description + article.text, re.IGNORECASE)
            if (len(swine) > 0):
                diseases = ["influenza a/h1n1"]
            elif (len(avian) > 0):
                diseases = ["influenza a/h5n1"]
            else:
                syndromes = ["Influenza-like illness"]

    # Seperate this event into Ebola or Marburg
    elif (event_type == "Ebola / Marburg"):
        ebola = re.findall(r'ebola', description, re.IGNORECASE)
        marburg = re.findall(r'marburg', description, re.IGNORECASE)
        if (len(ebola) > 0):
            diseases.append("ebola haemorrhagic fever")
        if (len(marburg) > 0):
            diseases.append("marburg virus disease")
        
    elif (event_type in DISEASE_TRANSLATIONS):
        diseases = [DISEASE_TRANSLATIONS[event_type]] # one to one translations
    elif (event_type in SYNDROME_TRANSLATIONS):
        syndromes = [SYNDROME_TRANSLATIONS[event_type]] # one to one translations

    if (len(diseases + syndromes) == 0):
        print("ERROR: event type translation failed for {} id={}".format(event_type, i))
        continue

    diseases = list(set(diseases)) # no duplicates
    syndromes = list(set(syndromes)) # no duplicates


    split = description.split('\n')
    if ("Update - " in split[0] or "Google" in split[0]):
        headline = clean(split[1].strip())
        main_text = clean('\n'.join(split[0:]).strip())
    else:
        headline = clean(split[0].strip())
        main_text = clean('\n'.join(split[1:]).strip())

    ret = {"_id": i,
           "date_of_publication": date,
           "url": url,
           "headline": headline,
           "main_text": main_text,
           "reports": [{
                "event_date": date,
                "locations":[{
                    "country": country,
                    "location": city,
                    "coords": "{}, {}".format(latitude, longitude)
                }],
                "diseases": diseases,
                "syndromes": syndromes
           }]
           }
    #print(json.dumps(ret, indent=4, sort_keys=True))

    db.replace_one({'_id':i}, ret, True) # replace or insert it

    latest_index = i


print("Last record parsed was {}".format(latest_index))

index_file = open("last_record_scraped.txt", "w")
index_file.write(str(latest_index))
index_file.close()


"""
TODO:
Extract information about number of cases/deaths from the descriptions
"""
