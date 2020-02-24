import requests
import re
from bs4 import BeautifulSoup
import time

BASE_URL = 'http://outbreaks.globalincidentmap.com/eventdetail.php?ID='
starting_index = 30000
ending_index = starting_index + 5


for i in range(starting_index, ending_index):
    event_page = requests.get(BASE_URL + str(i))
    event_soup = BeautifulSoup(event_page.text, 'html.parser')

    details = event_soup.find_all('td', {'class': 'tdline'})

    event_type = details[1].text.strip()
    date = details[3].text.strip()
    country = details[5].text.strip()
    city = details[7].text.strip()
    latitude = details[9].text.strip()
    longitude = details[11].text.strip()
    url = details[13].text.strip()


    descriptions = event_soup.find_all('strong')[7:9]
    short_description = descriptions[0].text.strip()
    long_description = descriptions[1].text.strip()
    
    print("Disease: {}\nDate: {}\nLocation: {}, {}\nLat/Long: {},{}\nLink: {}\nShort: {}\n Long: {}".format(event_type, date, country, city, latitude, longitude, url, short_description, long_description))

    time.sleep(5)    


"""
TODO:
Extract information about number of cases/deaths from the descriptions
"""
