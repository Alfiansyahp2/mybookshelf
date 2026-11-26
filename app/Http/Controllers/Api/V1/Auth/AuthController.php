<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Resources\Api\V1\Auth\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/** @noinspection PhpUndefinedMethodInspection */
class AuthController extends Controller
{
    /**
     * Login user and create SPA session.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::guard('web')->attempt($request->only('email', 'password'), $request->filled('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        $user = Auth::guard('web')->user();

        return response()->success([
            'user' => new UserResource($user),
        ], 'Login successful');
    }

    /**
     * Register new user (SPA).
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        Auth::guard('web')->login($user);
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return response()->success([
            'user' => new UserResource($user),
        ], 'Registration successful', 201);
    }

    /**
     * Get authenticated user info (SPA).
     */
    public function me(Request $request): JsonResponse
    {
        return response()->success([
            'user' => new UserResource($request->user()),
        ]);
    }

    /**
     * Logout user and end session (SPA).
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->success(null, 'Logged out successfully');
    }
}
