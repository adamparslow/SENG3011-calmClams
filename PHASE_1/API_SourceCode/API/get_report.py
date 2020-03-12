from API.main import mongo


def get_report(parameter):
    start_date = parameter.get("start_date")
    end_date = parameter.get("end_date")
    key_terms = parameter.get("key_terms")
    location = parameter.get("location")

    query = {
        "start_date": start_date,
        "end_date": end_date,
        "key_terms": key_terms,
        "location": location
    }
    # results = mongo.db.disease_reports.find(query)

    return parameter    # change to db query results



