<?php

namespace App\DataTransferObjects\Library;

use Illuminate\Http\Request;

readonly class BookFilterData
{
    public const DEFAULT_PER_PAGE = 24;

    public const MAX_PER_PAGE = 500;

    /**
     * @param  array<int, string>  $statuses
     * @param  array<int, string>  $excludeStatuses
     */
    public function __construct(
        public ?string $status = null,
        public array $statuses = [],
        public array $excludeStatuses = [],
        public ?string $shelfId = null,
        public ?bool $favorite = null,
        public ?bool $isReturned = null,
        public ?bool $overdue = null,
        public ?string $borrowedBy = null,
        public ?bool $hasNotes = null,
        public ?string $genre = null,
        public ?int $year = null,
        public ?string $search = null,
        public int $perPage = self::DEFAULT_PER_PAGE,
        public int $page = 1,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $perPageRaw = $request->query('per_page');
        $perPage = $perPageRaw !== null
            ? max(1, min(self::MAX_PER_PAGE, (int) $perPageRaw))
            : self::DEFAULT_PER_PAGE;

        return new self(
            status: self::nullableString($request->query('status')),
            statuses: self::parseStringList($request->query('statuses')),
            excludeStatuses: self::parseStringList($request->query('exclude_statuses')),
            shelfId: self::nullableString($request->query('shelf_id')),
            favorite: self::nullableBool($request->query('favorite')),
            isReturned: self::nullableBool($request->query('is_returned')),
            overdue: self::nullableBool($request->query('overdue')),
            borrowedBy: self::nullableString($request->query('borrowed_by')),
            hasNotes: self::nullableBool($request->query('has_notes')),
            genre: self::nullableString($request->query('genre')),
            year: $request->query('year') !== null ? (int) $request->query('year') : null,
            search: self::nullableString($request->query('search')),
            perPage: $perPage,
            page: max(1, (int) ($request->query('page', 1))),
        );
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public static function fromArray(array $filters): self
    {
        $perPageRaw = $filters['per_page'] ?? null;
        $perPage = $perPageRaw !== null
            ? max(1, min(self::MAX_PER_PAGE, (int) $perPageRaw))
            : self::DEFAULT_PER_PAGE;

        return new self(
            status: self::nullableString($filters['status'] ?? null),
            statuses: self::parseStringList($filters['statuses'] ?? null),
            excludeStatuses: self::parseStringList($filters['exclude_statuses'] ?? null),
            shelfId: self::nullableString($filters['shelf_id'] ?? null),
            favorite: self::nullableBool($filters['favorite'] ?? null),
            isReturned: self::nullableBool($filters['is_returned'] ?? null),
            overdue: self::nullableBool($filters['overdue'] ?? null),
            borrowedBy: self::nullableString($filters['borrowed_by'] ?? null),
            hasNotes: self::nullableBool($filters['has_notes'] ?? null),
            genre: self::nullableString($filters['genre'] ?? null),
            year: isset($filters['year']) ? (int) $filters['year'] : null,
            search: self::nullableString($filters['search'] ?? null),
            perPage: $perPage,
            page: max(1, (int) ($filters['page'] ?? 1)),
        );
    }

    private static function nullableString(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }

    private static function nullableBool(mixed $value): ?bool
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_bool($value)) {
            return $value;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    }

    /**
     * @return array<int, string>
     */
    private static function parseStringList(mixed $value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map('strval', $value)));
        }

        if (is_string($value) && trim($value) !== '') {
            return array_values(array_filter(array_map('trim', explode(',', $value))));
        }

        return [];
    }
}
