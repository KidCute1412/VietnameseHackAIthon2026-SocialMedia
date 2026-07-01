# Common API dependencies
from database import get_db
from vnsocial.smartbot_client import SmartBotClient

def get_smartbot_client() -> SmartBotClient:
    return SmartBotClient()
