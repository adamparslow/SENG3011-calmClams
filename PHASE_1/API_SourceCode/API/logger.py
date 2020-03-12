import logging
from flask import request


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
    logging.basicConfig(filename='requests.log', level=logging.DEBUG)
    logging.info("Endpoint accessed: " + str(request.endpoint))
    logging.info("Process time: " + str(process_time) + "ns")


def log_error(parameter):
    logging.basicConfig(filename='requests.log', level=logging.DEBUG)
    logging.error("Bad Request: " + str(parameter))
