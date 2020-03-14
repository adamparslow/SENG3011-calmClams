from main import mongo
from bson.json_util import dumps


def get_report(parameter):
    start_date = parameter.get("start_date")
    end_date = parameter.get("end_date")
    key_terms = parameter.get("key_terms")
    location = parameter.get("location")

    # probably more processing required

    query = {
        "start_date": start_date,
        "end_date": end_date,
        "key_terms": key_terms,
        "location": location
    }
    results = list(mongo.db.disease_reports.find(query))

    if len(results) == 0:
        return None

    return dumps(results)



