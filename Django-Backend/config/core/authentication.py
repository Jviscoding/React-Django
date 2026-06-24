from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

import jwt
import requests


class SupabaseJWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        
        
        auth = request.headers.get("Authorization")

        if not auth:
            return None

        if not auth.startswith("Bearer "):
            raise AuthenticationFailed("Invalid Authorization header")

        token = auth.split()[1]

        payload = self.verify_token(token)

        return (payload, token)
    
    def verify_token(self, token):

        jwks = requests.get(settings.SUPABASE_JWKS_URL).json()

        header = jwt.get_unverified_header(token)
        
        print(header)

        kid = header["kid"]
        key = None

        for k in jwks["keys"]:
            if k["kid"] == kid:
                key = k
                break

        if key is None:
            raise Exception("Key not found")

        public_key = jwt.algorithms.ECAlgorithm.from_jwk(key)  # ✔️ correct for ES256

        return jwt.decode(
            token,
            public_key,
            algorithms=["ES256"],
            audience=settings.SUPABASE_AUDIENCE,
            issuer=settings.SUPABASE_ISSUER,
        )