import requests
import re
from bs4 import BeautifulSoup
from word2number import w2n
import time
import os
import json

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

    "Schmallenberg Virus": "schmallenberg virus",
    "Newcastle Disease": "virulent newcastle disease",
    "Miscellaneous / Unknown Diseases or Illnesses": "unknown",
}

SYNDROME_TRANSLATIONS = {
    "Meningitis Outbreak ( Suspected or Confirmed)": "Meningitis",
    "Encephalitis": "Encephalitis",
}

"""
Uncategorised yet
    "Anthrax": "", #"anthrax cutaneous" "anthrax gastrointestinous" "anthrax inhalation"
    "Ebola / Marburg": "", # "ebola haemorrhagic fever" "marburg virus disease"
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
    index_file.write(LOWEST_RECORD_NUMBER - 1) # We want to scrape that record at some point
    index_file.close()

index_file = open(INDEX_FILE, "r")
latest_index = int(index_file.readline()) # Keep track of what we have successfully read. Write this number to file 
index_file.close()

starting_index = 33966#latest_index + 1 # Start from the record we couldn't read last time
ending_index = starting_index + 500
dead_count = 0
dead_threshold = 50


short_description_header = re.compile(r'\[.*?\][A-Z\s]* [:-]+ ')
leading_trailing_quotes = re.compile(r'"(.*)"')

# removes white space and unicode characters
def clean(string):
    string = re.sub(r'\r', '', string)
    string = re.sub(r'\n\n', '\n', string)
    string = re.sub(r'\n\n', '\n', string)
    string = short_description_header.sub(r' ', string)
    string = leading_trailing_quotes.sub(r'\1', string)
    string = re.sub(r'^\.', r'', string)
    string.replace('  ', ' ')
    return string.strip().encode('ascii', 'ignore').decode('ascii')

print("Scraping records from {} to {}".format(starting_index, ending_index))
for i in range(starting_index, ending_index, 1):
    if (dead_count >= dead_threshold):
        print("{} records in a row have been empty. Stopping now".format(dead_threshold))
        break
        
    time.sleep(5)
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

    if (event_type in IGNORED_EVENTS):
        dead_count = 0
        latest_index = i
        continue


    description = clean(event_soup.find_all('tr', {'class': 'tdtext'})[0].text)


    diseases = []
    syndromes = []
    if (event_type == "H7N9 / H5N1 / H5N2 / H7N1 / H7N3 / H7N7 / H5N8"):
        article = requests.get(url)
        influenzas = ["influenza a/" + x.lower() for x in re.findall(r'H\dN\d', description + article.text, re.IGNORECASE)]
        diseases = list(ALLOWED_INFLUENZA.intersection(influenzas))
        if (len(diseases) == 0):
            swine = re.findall(r'swine', description + article.text, re.IGNORECASE)
            avian = re.findall(r'avian', description + article.text, re.IGNORECASE)
            if (len(swine) > 0):
                diseases = ["influenza a/h1n1"]
            elif (len(avian) > 0):
                diseases = ["influenza a/h5n1"]
            else:
                syndromes = ["Influenza-like illness"]
    elif (event_type in DISEASE_TRANSLATIONS):
        diseases = [DISEASE_TRANSLATIONS[event_type]]
    elif (event_type in SYNDROME_TRANSLATIONS):
        syndromes = [SYNDROME_TRANSLATIONS[event_type]]
    else:
        print("ERROR: Could not translate {}".format(event_type))
        continue

    if (len(diseases + syndromes) == 0):
        print("ERROR: event type translation failed for {}\ndiseases={} syndromes={}".format(event_type, diseases, syndromes))
        continue

    
    #print("Disease: {}\nDate: {}\nLocation: {}, {}\nLat/Long: {},{}\nLink: {}\nShort: {}\n Long: {}\n\n".format(event_type, date, country, city, latitude, longitude, url, short_description, long_description))

    ret = {"date_of_publication": date,
           "url": url,
           "main_text": description,
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
    print(json.dumps(ret, indent=4, sort_keys=True))

    dead_count = 0
    latest_index = i


print("Last record parsed was {}".format(latest_index))

index_file = open("last_record_scraped.txt", "w")
index_file.write(str(latest_index))
index_file.close()


"""
TODO:
Extract information about number of cases/deaths from the descriptions
"""
