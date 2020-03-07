from flask import Blueprint, request, jsonify
from http import HTTPStatus
from API.logger import log_api_request, get_user_log
from API.get_report import get_report
from datetime import datetime
import time

DISEASE_REPORTS_BLUEPRINT = Blueprint("disease_reports", __name__)


@DISEASE_REPORTS_BLUEPRINT.route('/disease_reports/<test_input>', methods=["GET"])
def disease_reports(test_input):
    accessed_time = datetime.now()
    request_start_time = time.perf_counter_ns()

    parameter = request.json
    report = get_report(parameter)

    if report is None:
        # TODO add error log
        return jsonify({"invalid_request": "lol"}), HTTPStatus.BAD_REQUEST

    request_end_time = time.perf_counter_ns()
    log_api_request(request_end_time - request_start_time)
    return jsonify("PARAMETER", parameter, "USER LOG", get_user_log(accessed_time), "ARGUMENT", test_input)
