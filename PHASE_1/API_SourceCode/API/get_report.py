from bson.json_util import dumps


def get_report(parameter, database):
    start_date = parameter.get("start_date")
    end_date = parameter.get("end_date")
    key_terms = parameter.get("key_terms")
    location = parameter.get("location")

    return dumps(test_result)

    # probably more processing required

    query = {
        "start_date": start_date,
        "end_date": end_date,
        "key_terms": key_terms,
        "location": location
    }
    results = list(database.db.disease_reports.find(query))

    if len(results) == 0:
        return None

    return dumps(results)


test_result = [{
    "url": "https://www.who.int/csr/don/17-january-2020-novel-coronavirus-japan-exchina/en/",
    "date_of_publication": "2020-01-17 xx:xx:xx",
    "headline": "Novel Coronavirus – Japan (ex-China)",
    "main_text": "On 15 January 2020, the Ministry of Health, Labour and Welfare, Japan\n(MHLW) reported an imported case of laboratory-confirmed 2019-novel coronavirus (2019-\nnCoV) from Wuhan, Hubei Province, China. The case-patient is male, between the age of 30-\n39 years, living in Japan. The case-patient travelled to Wuhan, China in late December and\ndeveloped fever on 3 January 2020 while staying in Wuhan. He did not visit the Huanan\nSeafood Wholesale Market or any other live animal markets in Wuhan. He has indicated that\nhe was in close contact with a person with pneumonia. On 6 January, he traveled back to\nJapan and tested negative for influenza when he visited a local clinic on the same day.",
    "reports": [
        {
            "event_date": "2020-01-03 xx:xx:xx to 2020-01-15",
            "locations": [
                {
                    "country": "China",
                    "location": "Wuhan, Hubei Province"
                },
                {
                    "country": "Japan",
                    "location": ""
                }
            ],
            "diseases": [
                "2019-nCoV"
            ],
            "syndromes": [
                "Fever of unknown Origin"
            ]
        }
    ]
}]
