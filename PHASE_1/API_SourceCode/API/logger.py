from flask import request
from json import dumps


def get_user_log(accessed_time):
    log = {
            "team_name": "CalmClams",
            "accessed_time": str(accessed_time),
            "data_source": "outbreaks.globalincidentmap.com"
    }
    return log


# end_point, process_time_taken, resource_utilization
# write any monitoring data to a log file
def log_api_request(process_time):
    print("Endpoint accessed: " + str(request.endpoint))
    print("Process time: " + str(process_time) + "ns")


def log_error(accessed_time, parameter):
    print("Bad Request: " + dumps(parameter) + " at: " + str(accessed_time))
