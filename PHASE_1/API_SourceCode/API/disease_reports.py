from flask import Blueprint, request, jsonify
from http import HTTPStatus

DISEASE_REPORTS_BLUEPRINT = Blueprint("disease_reports", __name__)


@DISEASE_REPORTS_BLUEPRINT.route('/disease_reports/<test_input>', methods=["GET"])
def disease_reports(test_input):
    parameter = request.json

    if parameter == {}:
        return jsonify({"invalid_request": "lol"}), HTTPStatus.BAD_REQUEST

    return jsonify(parameter, test_input)
