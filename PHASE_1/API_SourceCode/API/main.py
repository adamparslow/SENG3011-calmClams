from flask import Flask
from pymongo import MongoClient
from disease_reports import DISEASE_REPORTS_BLUEPRINT
import dns

APP = Flask(__name__)
client = MongoClient('mongodb+srv://admin:admin@cluster0-zhnwq.gcp.mongodb.net/test?retryWrites=true&w=majority')
db = client["disease_reports"]
collection = db["beta"]
APP.collection = collection

APP.register_blueprint(DISEASE_REPORTS_BLUEPRINT)

if __name__ == "__main__":
    APP.run(host="127.0.0.1", port="5000")
