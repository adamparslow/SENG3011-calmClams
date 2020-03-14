from flask import Flask
from flask_pymongo import PyMongo
from API.disease_reports import DISEASE_REPORTS_BLUEPRINT

APP = Flask(__name__)
APP.config["MONGO_URI"] = "http://35.244.107.108:27017/"
mongo = PyMongo(APP)
APP.db = mongo

APP.register_blueprint(DISEASE_REPORTS_BLUEPRINT)

if __name__ == "__main__":
    APP.run(host="127.0.0.1", port=5000)
