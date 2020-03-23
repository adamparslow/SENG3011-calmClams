from urllib.parse import unquote
from datetime import datetime


def get_report(parameter, database):
    start_date = parameter.get("start_date")
    end_date = parameter.get("end_date")
    key_terms = parameter.get("key_terms")
    location = parameter.get("location")

    query_list = []
    if not start_date or not end_date:
        raise ValueError

    start_date = datetime.strptime(unquote(start_date.replace("T", " ")).strip("\\\""), "%Y-%m-%d %H:%M:%S")
    end_date = datetime.strptime(unquote(end_date.replace("T", " ")).strip("\\\""), "%Y-%m-%d %H:%M:%S")
    if end_date < start_date:
        raise ValueError

    query_list.append({"date_of_publication": {"$gte": start_date, "$lte": end_date}})

    if key_terms:
        key_terms = unquote(key_terms).replace(" ", "").split(",")
        for term in key_terms:
            term_query = {
                "$or": [
                    {"headline": {"$regex": term, "$options": "i"}},
                    {"main_text": {"$regex": term, "$options": "i"}}
                ]
            }
            query_list.append(term_query)

    if location:
        query_list.append({
                "$or": [
                    {"reports.locations.country": {"$regex": location, "$options": "i"}},
                    {"reports.locations.location": {"$regex": location, "$options": "i"}}
                ]
            })

    query = {"$and": query_list} if len(query_list) else {}
    results = list(database.find(query))

    if len(results) == 0:
        return None
    return results
