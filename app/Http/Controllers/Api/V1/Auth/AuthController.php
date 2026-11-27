<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Resources\Api\V1\Auth\UserResource;
use App\Models\User;
use App\Services\Accounting\ExpenseCategoryService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/** @noinspection PhpUndefinedMethodInspection */
class AuthController extends Controller
{
    public function __construct(
        private ExpenseCategoryService $expenseCategoryService
    ) {}

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
     * Register new user (SPA), initialize default expense categories, and send email verification.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data): User {
            $created = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            $this->expenseCategoryService->initializeDefaultsForUser($created->id);

            return $created;
        });

        event(new Registered($user));

        Auth::guard('web')->login($user);
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return response()->success([
            'user' => new UserResource($user->fresh()),
        ], 'Registration successful. Please verify your email address.', 201);
    }

    /**
     * Verify user's email address using signed verification URL.
     */
    public function verifyEmail(Request $request, string $id, string $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return response()->error('Invalid verification link', null, 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->success([
                'verified' => true,
                'user' => new UserResource($user),
            ], 'Email already verified');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->success([
            'verified' => true,
            'user' => new UserResource($user->fresh()),
        ], 'Email verified successfully');
    }

    /**
     * Resend email verification link for the authenticated user.
     */
    public function resendVerification(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->success(['verified' => true], 'Email already verified');
        }

        $user->sendEmailVerificationNotification();

        return response()->success(['sent' => true], 'Verification link sent');
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
