from flask import Blueprint, request, jsonify, current_app
from http import HTTPStatus
from logger import log_api_request, get_user_log, log_error
from get_report import get_report
from datetime import datetime
import time

DISEASE_REPORTS_BLUEPRINT = Blueprint("disease_reports", __name__)


@DISEASE_REPORTS_BLUEPRINT.route('/disease_reports', methods=["GET"])
def disease_reports():
    accessed_time = datetime.now()
    request_start_time = time.perf_counter_ns()

    parameter = request.args
    try:
        report = get_report(parameter, current_app.collection)
    except ValueError:
        log_error(accessed_time, parameter, HTTPStatus.BAD_REQUEST)
        return "400 Bad Request", HTTPStatus.BAD_REQUEST

    if report is None:
        log_error(accessed_time, parameter, HTTPStatus.NOT_FOUND)
        return "404 Not Found", HTTPStatus.NOT_FOUND

    request_end_time = time.perf_counter_ns()
    log_api_request(request_end_time - request_start_time, accessed_time, parameter)
    return jsonify({
        "parameter": parameter,
        "user_log": get_user_log(accessed_time),
        "articles": report
        })
