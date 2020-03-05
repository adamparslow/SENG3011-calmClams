from flask import Flask

from PHASE_1.API_SourceCode.API.disease_reports import DISEASE_REPORTS_BLUEPRINT

APP = Flask(__name__)

APP.register_blueprint(DISEASE_REPORTS_BLUEPRINT)

if __name__ == "__main__":
    APP.run(host="127.0.0.1", port=5000)
