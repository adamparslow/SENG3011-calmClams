from flask import Blueprint, request, jsonify, current_app
from schema import get_schema
import time
import json

GRAPHQL_BLUEPRINT = Blueprint("graphql_response", __name__)



@GRAPHQL_BLUEPRINT.route('/gql', methods=["POST"])
def gql_response():
    try:
        data = json.loads(request.data)
    except:
        return 'Query not JSON'
    schema = get_schema()
    result = schema.execute(data["query"])
    try:
        return json.dumps(result.data['articles'])
    except:
        return "Invalid GQL query"