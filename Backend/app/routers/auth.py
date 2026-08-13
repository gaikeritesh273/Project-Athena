from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.utils.supabase_client import get_supabase, get_supabase_admin
from app.models.schemas import SignupRequest

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/signup")
async def signup(req: SignupRequest):
    """Sign up with email, password, and profile details (full_name, phone, DOB)."""
    try:
        supabase = get_supabase()

        # Create auth user
        auth_response = supabase.auth.sign_up({
            "email": req.email,
            "password": req.password,
            "options": {
                "data": {
                    "full_name": req.full_name,
                    "phone": req.phone,
                    "date_of_birth": req.date_of_birth
                }
            }
        })

        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Signup failed — user not created")

        # Insert into profiles table using service role
        try:
            admin = get_supabase_admin()
            admin.table("profiles").insert({
                "id": auth_response.user.id,
                "email": req.email,
                "full_name": req.full_name,
                "phone": req.phone,
                "date_of_birth": req.date_of_birth,
                "literacy_score": 0,
                "badges": [],
                "investigations_count": 0
            }).execute()
        except Exception as profile_err:
            # Profile creation failed but auth succeeded — log and continue
            print(f"Profile creation warning: {profile_err}")

        return {
            "message": "Signup successful. Please check your email to verify.",
            "user_id": auth_response.user.id,
            "email": auth_response.user.email
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(req: LoginRequest):
    """Login with email and password. Returns JWT tokens."""
    try:
        supabase = get_supabase()
        auth_response = supabase.auth.sign_in_with_password({
            "email": req.email,
            "password": req.password
        })

        if not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "expires_in": auth_response.session.expires_in,
            "token_type": auth_response.session.token_type,
            "user": {
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "full_name": auth_response.user.user_metadata.get("full_name"),
                "phone": auth_response.user.user_metadata.get("phone"),
                "date_of_birth": auth_response.user.user_metadata.get("date_of_birth")
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh")
async def refresh_token(req: RefreshRequest):
    """Refresh access token using refresh token."""
    try:
        supabase = get_supabase()
        auth_response = supabase.auth.refresh_session(req.refresh_token)

        if not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "expires_in": auth_response.session.expires_in
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout():
    """Logout user and invalidate session."""
    try:
        supabase = get_supabase()
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me")
async def get_profile(user_id: str):
    """Get user profile from Supabase."""
    try:
        admin = get_supabase_admin()
        result = admin.table("profiles").select("*").eq("id", user_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
