import requests
import re
from bs4 import BeautifulSoup

BASE_URL = 'http://outbreaks.globalincidentmap.com/'

home = requests.get(BASE_URL)
index = BeautifulSoup(home.text, 'html.parser')


#for table in index_soup.find_all('td'):
#    print(table.text)

for disease in index.find_all('td', {"class": "events-head"}):
    print(disease.text)
    table = disease.find_parent('table').find_parent('table')
    events = table.find_all('table')[1].find('table').find_all('tr')

    # the first "event" is the title row
    for event in events[1:]:
        parts = event.find_all('td')
        if (len(parts) < 6):
            print(parts[0].text)
            continue
        date = parts[0].text
        link = parts[1].find('a').get('href')
        country = parts[2].text
        city = parts[3].text
        description = parts[5].text
        print("{}\nDate: {}\nLink: {}\nLocation: {} {}\nDescription: {}\n".format(disease.text, date, BASE_URL + link, country, city, description))


"""
TODO:
All the links seem to follow the structure
http://outbreaks.globalincidentmap.com/eventdetail.php?ID=XXXXX
Where XXXXX seems to increment with each new event.

We should pull the data from those instead of the home page (We can keep track of what we have already scraped easily and only look for new events)
"""
