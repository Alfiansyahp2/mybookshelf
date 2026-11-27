<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class AccountingTimelineEvent extends Model
{
    /** @use HasFactory<Factory<static>> */
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'user_id',
        'expense_id',
        'budget_id',
        'type',
        'event_date',
        'description',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'event_date' => 'datetime',
        'metadata' => 'array',
    ];

    /**
     * Get the user that owns the event.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the expense associated with the event.
     *
     * @return BelongsTo<Expense, $this>
     */
    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class);
    }

    /**
     * Get the budget associated with the event.
     *
     * @return BelongsTo<Budget, $this>
     */
    public function budget(): BelongsTo
    {
        return $this->belongsTo(Budget::class);
    }

    /**
     * Scope to only include events for a specific user.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeForUser(Builder $query, string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by event type.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to get events in date range.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeInPeriod(Builder $query, mixed $startDate, mixed $endDate): Builder
    {
        return $query->whereBetween('event_date', [$startDate, $endDate]);
    }

    /**
     * Scope to get recent events.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeRecent(Builder $query, int $days = 30): Builder
    {
        return $query->where('event_date', '>=', now()->subDays($days))
            ->orderBy('event_date', 'desc');
    }

    /**
     * Create an expense created event.
     *
     * @param  array<string, mixed>  $metadata
     */
    public static function expenseCreated(string $expenseId, string $userId, array $metadata = []): self
    {
        $expense = Expense::with('category')->find($expenseId);

        return static::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $userId,
            'expense_id' => $expenseId,
            'type' => 'expense_created',
            'event_date' => now(),
            'description' => "Expense '{$expense?->title}' created with amount {$expense?->formatted_amount}",
            'metadata' => array_merge($metadata, [
                'amount' => $expense?->amount,
                'currency' => $expense?->currency,
                'category' => $expense?->category?->name,
            ]),
        ]);
    }

    /**
     * Create a budget exceeded event.
     *
     * @param  array<string, mixed>  $metadata
     */
    public static function budgetExceeded(string $budgetId, string $userId, array $metadata = []): self
    {
        $budget = Budget::find($budgetId);

        return static::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $userId,
            'budget_id' => $budgetId,
            'type' => 'budget_exceeded',
            'event_date' => now(),
            'description' => "Budget '{$budget?->name}' exceeded by ".number_format((float) ($budget !== null ? $budget->usage_percentage : 0), 2).'%',
            'metadata' => array_merge($metadata, [
                'budget_amount' => $budget?->amount_base_currency,
                'spent_amount' => $budget?->total_spent,
                'usage_percentage' => $budget?->usage_percentage,
            ]),
        ]);
    }

    /**
     * Create a budget alert event.
     *
     * @param  array<string, mixed>  $metadata
     */
    public static function budgetAlert(string $budgetId, string $userId, array $metadata = []): self
    {
        $budget = Budget::find($budgetId);

        return static::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $userId,
            'budget_id' => $budgetId,
            'type' => 'budget_alert',
            'event_date' => now(),
            'description' => "Budget '{$budget?->name}' is at ".number_format((float) ($budget !== null ? $budget->usage_percentage : 0), 2).'% capacity',
            'metadata' => array_merge($metadata, [
                'budget_amount' => $budget?->amount_base_currency,
                'spent_amount' => $budget?->total_spent,
                'usage_percentage' => $budget?->usage_percentage,
                'alert_threshold' => $budget?->alert_threshold,
            ]),
        ]);
    }

    /**
     * Create a payment reminder event.
     *
     * @param  array<string, mixed>  $metadata
     */
    public static function paymentReminder(string $expenseId, string $userId, array $metadata = []): self
    {
        $expense = Expense::find($expenseId);

        return static::create([
            'id' => Str::uuid()->toString(),
            'user_id' => $userId,
            'expense_id' => $expenseId,
            'type' => 'payment_reminder',
            'event_date' => now(),
            'description' => "Payment reminder for expense '{$expense?->title}' due on ".($expense?->reminder_date ? $expense->reminder_date->format('Y-m-d') : 'N/A'),
            'metadata' => array_merge($metadata, [
                'amount' => $expense?->amount,
                'currency' => $expense?->currency,
                'due_date' => $expense?->reminder_date ? $expense->reminder_date->format('Y-m-d') : null,
            ]),
        ]);
    }

    /**
     * Get formatted event date.
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->event_date->format('Y-m-d H:i');
    }

    /**
     * Get event type label.
     */
    public function getTypeLabelAttribute(): string
    {
        $type = (string) $this->getAttribute('type');

        return match ($type) {
            'expense_created' => 'Expense Created',
            'expense_updated' => 'Expense Updated',
            'budget_exceeded' => 'Budget Exceeded',
            'budget_alert' => 'Budget Alert',
            'payment_reminder' => 'Payment Reminder',
            'currency_rate_updated' => 'Currency Rate Updated',
            default => 'Unknown',
        };
    }
}
