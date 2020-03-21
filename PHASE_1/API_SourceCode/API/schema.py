from graphene import ObjectType, String, Schema, List, Int, Field
from config import db


class Location(ObjectType):
    locationState = String()
    country = String()
    location = String()

    def resolve_country(self, info):
        return self.locationState["country"]

    def resolve_location(self, info):
        return self.locationState["location"]

class Report(ObjectType):
    report = String()
    diseases = List(String)
    syndromes = List(String)
    eventDate = String()
    location = List(Location)

    def resolve_diseases(self, info):
        return self.report["diseases"]

    def resolve_syndromes(self, info):
        return self.report["syndromes"]

    def resolve_eventDate(self, info):
        return self.report["event_date"]

    def resolve_location(self, info):
        return [Location(f) for f in self.report["locations"]]

class Article(ObjectType):
    article = String()
    url = String()
    dateOfPublication = String()
    headline = String()
    maintext = String()
    reports = List(Report)
    

    def resolve_dateOfPublication(self, info):
        return self.article["date_of_publication"]
    def resolve_headline(self, info):
        return self.article["headline"]
    def resolve_maintext(self, info):
        return self.article["main_text"]
    def resolve_url(self, info):
        return self.article["url"]
    def resolve_reports(self, info):
        return [Report(f) for f in self.article["reports"]]
    

class Query(ObjectType):
    articles = List(Article)

    def resolve_articles(self, info):
       collection = db.find()
       return [Article(f) for f in collection]

def get_schema():
    return Schema(query=Query)
