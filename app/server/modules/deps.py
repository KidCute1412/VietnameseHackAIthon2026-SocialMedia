# Common API dependencies
from database import get_db
from modules.verification.job_dispatcher import RQJobDispatcher
from integrations.vnpt.smartbot import SmartBotClient

def get_smartbot_client() -> SmartBotClient:
    return SmartBotClient()


def get_job_dispatcher() -> RQJobDispatcher:
    return RQJobDispatcher()
