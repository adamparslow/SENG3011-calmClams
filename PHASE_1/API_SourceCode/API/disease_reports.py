from flask import Blueprint, jsonify
from http import HTTPStatus

DISEASE_REPORTS_BLUEPRINT = Blueprint("disease_reports", __name__)


@DISEASE_REPORTS_BLUEPRINT.route('/disease_reports/<parameter>', methods=["GET"])
def disease_reports(parameter):
    if parameter == {}:
        return jsonify({"invalid_request": "lol"}), HTTPStatus.BAD_REQUEST

    return jsonify(parameter)
