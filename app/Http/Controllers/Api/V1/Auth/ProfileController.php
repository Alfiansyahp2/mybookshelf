<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\UpdatePasswordRequest;
use App\Http\Requests\Api\V1\Auth\UpdateProfileRequest;
use App\Http\Resources\Api\V1\Auth\UserResource;
use App\Services\Auth\ProfileService;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function __construct(
        private ProfileService $profileService
    ) {}

    /**
     * Update authenticated user's profile (name and email).
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $updatedUser = $this->profileService->updateProfile($request->user(), $request->validated());

        return response()->success([
            'user' => new UserResource($updatedUser),
        ], 'Profile updated successfully');
    }

    /**
     * Update authenticated user's password.
     */
    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $data = $request->validated();

        $this->profileService->updatePassword(
            $request->user(),
            $data['current_password'],
            $data['password']
        );

        return response()->success(null, 'Password updated successfully');
    }
}
