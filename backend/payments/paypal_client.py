import time
import uuid
import logging
from typing import Dict, Any, Optional
import requests
from backend.config import settings

logger = logging.getLogger(__name__)

class PayPalClient:
    def __init__(self):
        self.base_url = settings.PAYPAL_BASE_URL.rstrip("/")
        self.client_id = settings.PAYPAL_CLIENT_ID
        self.client_secret = settings.PAYPAL_CLIENT_SECRET
        self._cached_token = None
        self._token_expiry = 0

    def is_configured(self) -> bool:
        """Checks if real PayPal sandbox credentials are provided."""
        return bool(
            self.client_id 
            and self.client_secret 
            and not self.client_id.startswith("mock_") 
            and not self.client_id.startswith("your_")
            and not self.client_id == "test"
            and not self.client_id.startswith("test_")
        )

    def get_access_token(self) -> str:
        """Retrieves and caches OAuth2 access token from PayPal Sandbox."""
        if not self.is_configured():
            return "simulated_sandbox_token"

        now = time.time()
        if self._cached_token and now < (self._token_expiry - 60):
            return self._cached_token

        url = f"{self.base_url}/v1/oauth2/token"
        headers = {
            "Accept": "application/json",
            "Accept-Language": "en_US"
        }
        data = {"grant_type": "client_credentials"}

        try:
            response = requests.post(
                url,
                auth=(self.client_id, self.client_secret),
                headers=headers,
                data=data,
                timeout=15
            )
            response.raise_for_status()
            res_json = response.json()
            self._cached_token = res_json["access_token"]
            self._token_expiry = now + res_json.get("expires_in", 3600)
            return self._cached_token
        except Exception as e:
            logger.error(f"Failed to retrieve PayPal access token: {e}")
            raise

    def create_order(
        self,
        amount: float,
        currency: str = "USD",
        return_url: str = "http://localhost:3000/projects/payment?status=success",
        cancel_url: str = "http://localhost:3000/projects/payment?status=cancel",
        reference_id: Optional[str] = None,
        custom_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Creates a PayPal Order using Orders v2 API.
        Returns order dict including the order ID and approval URL.
        """
        if not self.is_configured():
            simulated_order_id = f"SANDBOX-ORD-{uuid.uuid4().hex[:12].upper()}"
            return {
                "id": simulated_order_id,
                "status": "CREATED",
                "links": [
                    {
                        "href": f"https://www.sandbox.paypal.com/checkoutnow?token={simulated_order_id}",
                        "rel": "approve",
                        "method": "GET"
                    }
                ],
                "is_simulated": True
            }

        access_token = self.get_access_token()
        url = f"{self.base_url}/v2/checkout/orders"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        # PayPal amounts must have 2 decimal places
        formatted_amount = f"{amount:.2f}"

        payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "reference_id": reference_id or str(uuid.uuid4()),
                    "custom_id": custom_id or "",
                    "description": "PayPilot Project Milestone Payment",
                    "amount": {
                        "currency_code": currency.upper(),
                        "value": formatted_amount
                    }
                }
            ],
            "application_context": {
                "return_url": return_url,
                "cancel_url": cancel_url,
                "brand_name": "PayPilot",
                "user_action": "PAY_NOW"
            }
        }

        response = requests.post(url, headers=headers, json=payload, timeout=15)
        response.raise_for_status()
        return response.json()

    def get_order_details(self, order_id: str) -> Dict[str, Any]:
        """Retrieves order status and purchase units from PayPal."""
        if not self.is_configured() or order_id.startswith("SANDBOX-ORD-"):
            return {
                "id": order_id,
                "status": "APPROVED",
                "purchase_units": [{"amount": {"value": "100.00", "currency_code": "USD"}}],
                "is_simulated": True
            }

        access_token = self.get_access_token()
        url = f"{self.base_url}/v2/checkout/orders/{order_id}"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        return response.json()

    def capture_order(self, order_id: str) -> Dict[str, Any]:
        """
        Captures an authorized PayPal payment order on the server.
        Only valid if order status is APPROVED.
        """
        if not self.is_configured() or order_id.startswith("SANDBOX-ORD-"):
            capture_id = f"SANDBOX-CAP-{uuid.uuid4().hex[:12].upper()}"
            return {
                "id": order_id,
                "status": "COMPLETED",
                "purchase_units": [
                    {
                        "payments": {
                            "captures": [
                                {
                                    "id": capture_id,
                                    "status": "COMPLETED",
                                    "amount": {"value": "100.00", "currency_code": "USD"}
                                }
                            ]
                        }
                    }
                ],
                "is_simulated": True
            }

        access_token = self.get_access_token()
        url = f"{self.base_url}/v2/checkout/orders/{order_id}/capture"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        response = requests.post(url, headers=headers, json={}, timeout=15)
        response.raise_for_status()
        return response.json()

    def verify_webhook_signature(
        self,
        transmission_id: str,
        transmission_time: str,
        cert_url: str,
        auth_algo: str,
        transmission_sig: str,
        webhook_id: str,
        webhook_event_payload: dict
    ) -> bool:
        """
        Verifies incoming PayPal webhook authenticity via official verify-webhook-signature API.
        """
        if not self.is_configured():
            # In local simulation mode without sandbox keys, accept the event if event_id is present
            return bool(webhook_event_payload.get("id"))

        access_token = self.get_access_token()
        url = f"{self.base_url}/v1/notifications/verify-webhook-signature"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        payload = {
            "transmission_id": transmission_id,
            "transmission_time": transmission_time,
            "cert_url": cert_url,
            "auth_algo": auth_algo,
            "transmission_sig": transmission_sig,
            "webhook_id": webhook_id or settings.PAYPAL_WEBHOOK_ID,
            "webhook_event": webhook_event_payload
        }
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=15)
            response.raise_for_status()
            return response.json().get("verification_status") == "SUCCESS"
        except Exception as e:
            logger.error(f"Error verifying PayPal webhook signature: {e}")
            return False

paypal_client = PayPalClient()
