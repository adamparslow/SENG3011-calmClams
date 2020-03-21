from flask import Blueprint, request, jsonify, current_app
from http import HTTPStatus
from gql_schema import get_schema
import time
import json

GRAPHQL_BLUEPRINT = Blueprint("graphql_response", __name__)



@GRAPHQL_BLUEPRINT.route('/gql', methods=["POST"])
def gql_response():
    try:
        data = json.loads(request.data)
    except:
        return 'Query not JSON', HTTPStatus.BAD_REQUEST
    schema = get_schema()
    result = schema.execute(data["query"])
    try:
        return json.dumps(result.data['articles'])
    except:
        return "Invalid GQL query", HTTPStatus.BAD_REQUEST