<?php

namespace App\DataTransferObjects\Analytics;

readonly class DashboardSummaryData
{
    /**
     * @param  array<string, int|float|string>  $overview
     * @param  array<int, array<string, int|float>>  $yearlyStats
     * @param  array<int, array{name: string, count: int}>  $genreChart
     * @param  array<int, array{name: string, count: int}>  $authorChart
     * @param  array<string, int>  $statusCounts
     * @param  array<int, array<string, mixed>>  $currentlyReading
     * @param  array<int, array<string, mixed>>  $topReadBooks
     * @param  array<int, array<string, mixed>>  $recentBooks
     * @param  array<int, array<string, mixed>>  $recentlyFinished
     * @param  array<int, string>  $bookColors
     * @param  array<int, array<string, mixed>>  $dailyActivity
     * @param  array<int, array<string, mixed>>  $activityBooks
     */
    public function __construct(
        public array $overview,
        public array $yearlyStats,
        public array $genreChart,
        public array $authorChart,
        public array $statusCounts,
        public array $currentlyReading,
        public array $topReadBooks,
        public array $recentBooks,
        public array $recentlyFinished,
        public array $bookColors,
        public array $dailyActivity,
        public array $activityBooks,
        public string $generatedAt,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'overview' => $this->overview,
            'yearly_stats' => $this->yearlyStats,
            'genre_chart' => $this->genreChart,
            'author_chart' => $this->authorChart,
            'status_counts' => $this->statusCounts,
            'currently_reading' => $this->currentlyReading,
            'top_read_books' => $this->topReadBooks,
            'recent_books' => $this->recentBooks,
            'recently_finished' => $this->recentlyFinished,
            'book_colors' => $this->bookColors,
            'daily_activity' => $this->dailyActivity,
            'activity_books' => $this->activityBooks,
            'generated_at' => $this->generatedAt,
        ];
    }
}
