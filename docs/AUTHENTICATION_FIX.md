# Authentication Fix - CSRF Token Mismatch

## Problem
The application was experiencing "CSRF token mismatch" errors (419 status) when attempting to login. This was caused by a mismatch between the authentication method configured in the backend and the frontend expectations.

## Root Cause
The authentication system was configured for **token-based authentication** (typically used for mobile apps) but the frontend expected **SPA session-based authentication**.

- Backend was using `createToken()` which generates API tokens
- Frontend was expecting Bearer tokens in Authorization headers
- Laravel Sanctum CSRF protection was active but the frontend wasn't following the SPA authentication flow

## Solution
Converted the entire authentication system from token-based to **SPA session-based authentication** using Laravel Sanctum.

### Changes Made

#### 1. Backend (`app/Http/Controllers/Api/V1/AuthController.php`)
**Login Method:**
- Changed from `createToken()` → `Auth::guard('web')->attempt()`
- Added session regeneration for security
- Returns only user data (no token)

**Register Method:**
- Changed from returning API token → logging in user immediately
- Uses `Auth::guard('web')->login()` for instant session creation
- Returns only user data (no token)

**Logout Method:**
- Uses `Auth::guard('web')->logout()` instead of token revocation
- Invalidates session properly

#### 2. Frontend (`frontend/src/lib/api/auth.ts`)
**Added CSRF Cookie Handling:**
- New `getCsrfCookie()` method to call `/sanctum/csrf-cookie`
- Login and register methods now call `getCsrfCookie()` before authentication

**Removed Token Logic:**
- Removed `token` and `token_type` from `AuthResponse` interface
- Removed token validation from login/register methods

#### 3. Frontend (`frontend/src/hooks/useAuth.ts`)
**useAuthUser Hook:**
- Removed token-based query enabling
- Now relies on server-side session validation

**Login/Register Hooks:**
- Removed `localStorage.setItem('auth_token', data.token)` 
- Only store user data, not tokens

**Logout Hook:**
- Removed token removal logic

#### 4. Frontend (`frontend/src/lib/apiClient.ts`)
**Request Interceptor:**
- Removed `Authorization: Bearer ${token}` header logic
- Now relies solely on cookies (which are handled automatically)

**Response Interceptor:**
- Changed from removing `auth_token` to removing `user` on 401 errors
- Kept `withCredentials: true` for cookie handling

## How It Works Now

### SPA Authentication Flow:
1. **Frontend** calls `GET /sanctum/csrf-cookie` 
2. **Laravel** sets CSRF cookie in the browser
3. **Frontend** calls `POST /api/v1/auth/login` with credentials
4. **Laravel** validates credentials and creates session
5. **Laravel** sets session cookie in the browser
6. **Frontend** makes authenticated requests using the session cookie automatically

### Configuration Files:
- **SANCTUM_STATEFUL_DOMAINS** in `.env`: `localhost:5173,localhost:3000`
- **CORS configuration** (`config/cors.php`): Includes `sanctum/csrf-cookie` path and `supports_credentials: true`
- **API client** (`apiClient.ts`): `withCredentials: true` for cookie handling

## Benefits
✅ No need to manage tokens in localStorage  
✅ Automatic CSRF protection  
✅ Session-based security (same as traditional web apps)  
✅ Works seamlessly with Laravel's session system  
✅ More secure for SPA applications  

## Testing
After clearing all caches, the login should work without CSRF errors:
1. Frontend calls `/sanctum/csrf-cookie`
2. Frontend posts credentials to `/api/v1/auth/login`
3. Server validates and creates session
4. Subsequent requests use the session cookie automatically

## Files Modified
- `app/Http/Controllers/Api/V1/AuthController.php`
- `frontend/src/lib/api/auth.ts`
- `frontend/src/hooks/useAuth.ts`
- `frontend/src/lib/apiClient.ts`

## Notes
- Make sure your frontend URL is included in `SANCTUM_STATEFUL_DOMAINS`
- The Vite dev server runs on port 5173 by default
- All API requests must include `withCredentials: true` (already configured in apiClient)
- Session configuration in `.env`: `SESSION_DOMAIN=localhost`