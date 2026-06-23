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

        kid = header["kid"]

        public_key = None

        for key in jwks["keys"]:
            if key["kid"] == kid:
                public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
                break

        if public_key is None:
            raise AuthenticationFailed("Public key not found")

        return jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=settings.SUPABASE_AUDIENCE,
            issuer=settings.SUPABASE_ISSUER,
        )