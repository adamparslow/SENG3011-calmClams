from flask import Blueprint, request, jsonify
from http import HTTPStatus
from PHASE_1.API_SourceCode.API.logger import log_api_request, user_log
from datetime import datetime
import time

DISEASE_REPORTS_BLUEPRINT = Blueprint("disease_reports", __name__)


@DISEASE_REPORTS_BLUEPRINT.route('/disease_reports/<test_input>', methods=["GET"])
def disease_reports(test_input):
    accessed_time = datetime.now()
    request_start_time = time.perf_counter_ns()
    parameter = request.json

    # testing purposes
    if parameter is None:
        parameter = {
            "start_date": "test",
            "end_date": "test",
            "key_terms": "test",
            "location": "location"
        }

    start_date = parameter.get("start_date")
    end_date = parameter.get("end_date")
    key_terms = parameter.get("key_terms")
    location = parameter.get("location")

    if parameter == {}:
        # TODO add error log
        return jsonify({"invalid_request": "lol"}), HTTPStatus.BAD_REQUEST

    request_end_time = time.perf_counter_ns()
    log_api_request(request_end_time - request_start_time)
    return jsonify("PARAMETER", parameter, "USER LOG", user_log(accessed_time), "ARGUMENT", test_input)
