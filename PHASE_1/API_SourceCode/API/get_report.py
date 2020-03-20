
def get_report(parameter, database):
    start_date = parameter.get("start_date")    # possibly add default value that acts as no query?
    end_date = parameter.get("end_date")
    key_terms = parameter.get("key_terms")
    location = parameter.get("location")

    # probably more processing required if default values dont work

    query = [
        {"start_date": start_date},
        {"end_date": end_date},
        {"key_terms": key_terms},
        {"location": location}
    ]
    results = list(database.find())

    if len(results) == 0:
        return None

    return results[0]
