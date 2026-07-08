<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class AccountingTimelineEvent extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
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
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the expense associated with the event.
     */
    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class);
    }

    /**
     * Get the budget associated with the event.
     */
    public function budget(): BelongsTo
    {
        return $this->belongsTo(Budget::class);
    }

    /**
     * Scope to only include events for a specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by event type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to get events in date range.
     */
    public function scopeInPeriod($query, $startDate, $endDate)
    {
        return $query->whereBetween('event_date', [$startDate, $endDate]);
    }

    /**
     * Scope to get recent events.
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('event_date', '>=', now()->subDays($days))
                    ->orderBy('event_date', 'desc');
    }

    /**
     * Create an expense created event.
     */
    public static function expenseCreated($expenseId, $userId, $metadata = []): self
    {
        $expense = Expense::find($expenseId);

        return static::create([
            'id' => Str::uuid(),
            'user_id' => $userId,
            'expense_id' => $expenseId,
            'type' => 'expense_created',
            'event_date' => now(),
            'description' => "Expense '{$expense->title}' created with amount {$expense->formatted_amount}",
            'metadata' => array_merge($metadata, [
                'amount' => $expense->amount,
                'currency' => $expense->currency,
                'category' => $expense->category?->name,
            ]),
        ]);
    }

    /**
     * Create a budget exceeded event.
     */
    public static function budgetExceeded($budgetId, $userId, $metadata = []): self
    {
        $budget = Budget::find($budgetId);

        return static::create([
            'id' => Str::uuid(),
            'user_id' => $userId,
            'budget_id' => $budgetId,
            'type' => 'budget_exceeded',
            'event_date' => now(),
            'description' => "Budget '{$budget->name}' exceeded by " . number_format($budget->usage_percentage, 2) . "%",
            'metadata' => array_merge($metadata, [
                'budget_amount' => $budget->amount_base_currency,
                'spent_amount' => $budget->total_spent,
                'usage_percentage' => $budget->usage_percentage,
            ]),
        ]);
    }

    /**
     * Create a budget alert event.
     */
    public static function budgetAlert($budgetId, $userId, $metadata = []): self
    {
        $budget = Budget::find($budgetId);

        return static::create([
            'id' => Str::uuid(),
            'user_id' => $userId,
            'budget_id' => $budgetId,
            'type' => 'budget_alert',
            'event_date' => now(),
            'description' => "Budget '{$budget->name}' is at " . number_format($budget->usage_percentage, 2) . "% capacity",
            'metadata' => array_merge($metadata, [
                'budget_amount' => $budget->amount_base_currency,
                'spent_amount' => $budget->total_spent,
                'usage_percentage' => $budget->usage_percentage,
                'alert_threshold' => $budget->alert_threshold,
            ]),
        ]);
    }

    /**
     * Create a payment reminder event.
     */
    public static function paymentReminder($expenseId, $userId, $metadata = []): self
    {
        $expense = Expense::find($expenseId);

        return static::create([
            'id' => Str::uuid(),
            'user_id' => $userId,
            'expense_id' => $expenseId,
            'type' => 'payment_reminder',
            'event_date' => now(),
            'description' => "Payment reminder for expense '{$expense->title}' due on " . ($expense->reminder_date ? $expense->reminder_date->format('Y-m-d') : 'N/A'),
            'metadata' => array_merge($metadata, [
                'amount' => $expense->amount,
                'currency' => $expense->currency,
                'due_date' => $expense->reminder_date ? $expense->reminder_date->format('Y-m-d') : null,
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
        $labels = [
            'expense_created' => 'Expense Created',
            'expense_updated' => 'Expense Updated',
            'budget_exceeded' => 'Budget Exceeded',
            'budget_alert' => 'Budget Alert',
            'payment_reminder' => 'Payment Reminder',
            'currency_rate_updated' => 'Currency Rate Updated',
        ];

        return $labels[$this->type] ?? 'Unknown';
    }
}