# Claim Extractor Service using SmartBot LLM
from typing import Any, List
from integrations.vnpt.smartbot import SmartBotClient

class ClaimExtractorService:
    def __init__(self, smartbot_client: SmartBotClient):
        self.client = smartbot_client

    async def extract(self, text: str) -> List[Any]:
        # Placeholder logic: calls SmartBot LLM to find claims
        res = await self.client.extract_claims(text)
        return res.get("claims", [])
