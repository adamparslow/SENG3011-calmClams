from flask import Flask
from pymongo import MongoClient
from disease_reports import DISEASE_REPORTS_BLUEPRINT
import dns
from gql_endpoint import GRAPHQL_BLUEPRINT
import flask_monitoringdashboard as dashboard

app = Flask(__name__)
client = MongoClient('mongodb+srv://admin:admin@cluster0-zhnwq.gcp.mongodb.net/test?retryWrites=true&w=majority')
db = client["disease_reports"]
collection = db["beta"]
app.collection = collection
dashboard.bind(app)

app.register_blueprint(DISEASE_REPORTS_BLUEPRINT)
app.register_blueprint(GRAPHQL_BLUEPRINT)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port="5001")
