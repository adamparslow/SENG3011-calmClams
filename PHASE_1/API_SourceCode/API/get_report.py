from urllib.parse import unquote
from datetime import datetime


def get_report(parameter, database):
    start_date = parameter.get("start_date")
    start_date = datetime.strptime(unquote(start_date).strip("\\\""), "%Y-%m-%d %H:%M:%S") if start_date else None   # check format is same as in db

    end_date = parameter.get("end_date")
    end_date = datetime.strptime(unquote(end_date).strip("\\\""), "%Y-%m-%d %H:%M:%S") if end_date else None  # check format is same as in db

    key_terms = parameter.get("key_terms", "")      # process list of strings, check default

    location = parameter.get("location")    # process location
    print(start_date)
    print(end_date)
    query = {"$and": [
        {"articles.date_of_publication": {"$gte": start_date, "$lt": end_date}},
        #{"key_terms": key_terms},
        #{"location": location}
    ]}
    results = list(database.find(query))
    print("Number of results: ", len(results))

    if len(results) == 0:
        return None

    return results
