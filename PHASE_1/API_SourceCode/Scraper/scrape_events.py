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


if (not os.path.exists(INDEX_FILE)):
    print("{} does not exist. Creating one...".format(INDEX_FILE))
    index_file = open("last_record_scraped.txt", "w")
    index_file.write(LOWEST_RECORD_NUMBER)
    index_file.close()

index_file = open(INDEX_FILE, "r")
latest_index = int(index_file.readline())
index_file.close()

starting_index = latest_index + 1
ending_index = starting_index + 500
dead_count = 0
dead_threshold = 2


short_description_header = re.compile(r'\[.*?\][A-Z\s]* [:-]+ ')
leading_trailing_quotes = re.compile(r'"(.*)"')

# removes white space and unicode characters
def clean(string):
    #string = re.sub(r'\n', '. ', string)
    string = re.sub(r'\r', '', string)
    string = short_description_header.sub(r' ', string)
    string = leading_trailing_quotes.sub(r'\1', string)
    string = re.sub(r'^\.', r'', string)
    """string.replace(' .','.')
    string.replace(' .','.')
    string.replace('..','.')
    string.replace('..','.')
    string.replace('..','.')"""
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

    description = clean(event_soup.find_all('tr', {'class': 'tdtext'})[0].text)
    
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
                "diseases": [event_type],
                "syndromes": [event_type]
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
