import requests
import re
from bs4 import BeautifulSoup
from word2number import w2n
import time
import json

BASE_URL = 'http://outbreaks.globalincidentmap.com/eventdetail.php?ID='
starting_index = 101
ending_index = starting_index + 36000

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

for i in range(starting_index, ending_index, 99):
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


"""
TODO:
Extract information about number of cases/deaths from the descriptions
"""
