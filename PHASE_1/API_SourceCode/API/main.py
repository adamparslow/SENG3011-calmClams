from flask import Flask
from flask_pymongo import PyMongo
from disease_reports import DISEASE_REPORTS_BLUEPRINT
from gql_endpoint import GRAPHQL_BLUEPRINT

APP = Flask(__name__)
APP.config["MONGO_URI"] = "mongodb://admin:admin@cluster0-zhnwq.gcp.mongodb.net/test?retryWrites=true&w=majority"
mongo = PyMongo(APP)
APP.db = mongo

APP.register_blueprint(DISEASE_REPORTS_BLUEPRINT)
APP.register_blueprint(GRAPHQL_BLUEPRINT)

if __name__ == "__main__":
    APP.run(host="127.0.0.1", port="5001")
