from flask import request
from json import dumps


def get_user_log(accessed_time):
    log = {
            "team_name": "CalmClams",
            "accessed_time": str(accessed_time),
            "data_source": "outbreaks.globalincidentmap.com"
    }
    return log


def log_api_request(process_time, accessed_time, parameter):
    print("Endpoint accessed: " + str(request.endpoint))
    print("Time accessed: " + str(accessed_time))
    print("Parameter used: " + dumps(parameter))
    print("Process time: " + str(process_time) + "ns")


def log_error(accessed_time, parameter, error_code):
    print("Endpoint accessed: " + str(request.endpoint))
    print("Time accessed: " + str(accessed_time))
    print("Parameter used: " + dumps(parameter))
    print("An error occurred with error code: ", error_code.value)
