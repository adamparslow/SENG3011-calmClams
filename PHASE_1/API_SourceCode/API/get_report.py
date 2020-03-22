from urllib.parse import unquote
from datetime import datetime


def get_report(parameter, database):
    start_date = parameter.get("start_date")
    end_date = parameter.get("end_date")
    key_terms = parameter.get("key_terms")

    location = parameter.get("location")            # process location

    query_list = []

    if start_date and end_date:
        start_date = datetime.strptime(unquote(start_date).strip("\\\""), "%Y-%m-%d %H:%M:%S")  # TODO catch format errors
        end_date = datetime.strptime(unquote(end_date).strip("\\\""), "%Y-%m-%d %H:%M:%S")      # TODO catch format errors
        query_list.append({"date_of_publication": {"$gte": start_date, "$lte": end_date}})

    if key_terms:
        key_terms = unquote(key_terms).replace(" ", "").split(",")                              # TODO catch errors?
        for term in key_terms:
            term_query = {
                "$or": [
                    {"headline": {"$regex": term, "$options": "i"}},
                    {"main_text": {"$regex": term, "$options": "i"}}
                ]
            }
            query_list.append(term_query)

    query = {"$and": query_list}

    results = list(database.find(query))

    if len(results) == 0:
        return None

    return results
