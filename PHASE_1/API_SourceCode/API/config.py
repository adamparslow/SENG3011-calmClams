from pymongo import MongoClient   
import dns # required for connecting with SRV

client = MongoClient('mongodb+srv://admin:admin@cluster0-zhnwq.gcp.mongodb.net/test?retryWrites=true&w=majority')
db = client["disease_reports"]["alpha"]


