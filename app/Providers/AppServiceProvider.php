<?php

namespace App\Providers;

use App\Contracts\Storage\MediaStorageInterface;
use App\Events\BookFinished;
use App\Events\BookSaved;
use App\Events\ExpenseUpdated;
use App\Events\ReadingSessionCompleted;
use App\Listeners\EvaluateUserAchievements;
use App\Listeners\InvalidateAnalyticsCache;
use App\Models\Book;
use App\Observers\BookObserver;
use App\Services\Storage\DiskMediaStorage;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(MediaStorageInterface::class, DiskMediaStorage::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();

        Book::observe(BookObserver::class);

        Event::listen(BookSaved::class, [InvalidateAnalyticsCache::class, 'handleBookSaved']);
        Event::listen(BookFinished::class, [InvalidateAnalyticsCache::class, 'handleBookFinished']);
        Event::listen(BookFinished::class, [EvaluateUserAchievements::class, 'handleBookFinished']);
        Event::listen(ReadingSessionCompleted::class, [InvalidateAnalyticsCache::class, 'handleSessionCompleted']);
        Event::listen(ReadingSessionCompleted::class, [EvaluateUserAchievements::class, 'handleSessionCompleted']);
        Event::listen(ExpenseUpdated::class, [InvalidateAnalyticsCache::class, 'handleExpenseUpdated']);

        // Register API response macros
        Response::macro('success', function ($data = null, $message = 'Success', $statusCode = 200) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $data,
            ], $statusCode);
        });

        Response::macro('error', function ($message = 'Error', $errors = null, $statusCode = 400) {
            $response = [
                'success' => false,
                'message' => $message,
            ];

            if ($errors !== null) {
                $response['errors'] = $errors;
            }

            return response()->json($response, $statusCode);
        });
    }

    private function configureRateLimiting(): void
    {
        RateLimiter::for('auth', function (Request $request): Limit {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('register', function (Request $request): Limit {
            return Limit::perMinutes(10, 3)->by($request->ip());
        });

        RateLimiter::for('api', function (Request $request): Limit {
            return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('uploads', function (Request $request): Limit {
            return Limit::perMinute(15)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('exports', function (Request $request): Limit {
            return Limit::perMinute(5)->by($request->user()?->id ?: $request->ip());
        });
    }
}
