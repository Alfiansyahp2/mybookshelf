<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Budget extends Model
{
    /** @use HasFactory<Factory<static>> */
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'user_id',
        'category_id',
        'name',
        'description',
        'amount',
        'currency',
        'amount_base_currency',
        'period',
        'start_date',
        'end_date',
        'alert_threshold',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'amount_base_currency' => 'decimal:2',
        'alert_threshold' => 'decimal:2',
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the user that owns the budget.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category associated with the budget.
     *
     * @return BelongsTo<ExpenseCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ExpenseCategory::class, 'category_id');
    }

    /**
     * Scope to only include budgets for a specific user.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeForUser(Builder $query, string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to only include active budgets.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by period.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeByPeriod(Builder $query, string $period): Builder
    {
        return $query->where('period', $period);
    }

    /**
     * Scope to get current budgets (based on date).
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeCurrent(Builder $query): Builder
    {
        $now = now();

        return $query->where('start_date', '<=', $now)
            ->where(function ($q) use ($now) {
                $q->where('end_date', '>=', $now)
                    ->orWhereNull('end_date');
            });
    }

    /**
     * Calculate total spent for this budget.
     */
    public function getTotalSpentAttribute(): float
    {
        if ($this->category_id) {
            // If budget is for a specific category, get expenses from that category
            return (float) Expense::where('category_id', $this->category_id)
                ->where('user_id', $this->user_id)
                ->whereBetween('expense_date', [$this->start_date, $this->end_date ?? now()])
                ->completed()
                ->sum('amount_base_currency');
        }

        // Otherwise, get all expenses for the period
        return (float) Expense::where('user_id', $this->user_id)
            ->whereBetween('expense_date', [$this->start_date, $this->end_date ?? now()])
            ->completed()
            ->sum('amount_base_currency');
    }

    /**
     * Calculate remaining budget.
     */
    public function getRemainingAmountAttribute(): float
    {
        return max(0, (float) $this->amount_base_currency - $this->getTotalSpentAttribute());
    }

    /**
     * Calculate budget usage percentage.
     */
    public function getUsagePercentageAttribute(): float
    {
        if ((float) $this->amount_base_currency <= 0) {
            return 0;
        }

        return ($this->getTotalSpentAttribute() / (float) $this->amount_base_currency) * 100;
    }

    /**
     * Check if budget is exceeded.
     */
    public function isExceeded(): bool
    {
        return $this->getUsagePercentageAttribute() > 100;
    }

    /**
     * Check if budget is at alert threshold.
     */
    public function isAtAlertThreshold(): bool
    {
        $usage = $this->getUsagePercentageAttribute();

        return $usage >= (float) $this->alert_threshold && $usage <= 100;
    }

    /**
     * Get formatted budget amount.
     */
    public function getFormattedAmountAttribute(): string
    {
        return number_format((float) $this->amount_base_currency, 2, ',', '.').' IDR';
    }

    /**
     * Get formatted spent amount.
     */
    public function getFormattedSpentAttribute(): string
    {
        return number_format($this->getTotalSpentAttribute(), 2, ',', '.').' IDR';
    }

    /**
     * Get formatted remaining amount.
     */
    public function getFormattedRemainingAttribute(): string
    {
        return number_format($this->getRemainingAmountAttribute(), 2, ',', '.').' IDR';
    }

    /**
     * Get the status of the budget.
     */
    public function getStatusAttribute(): string
    {
        if (! $this->is_active) {
            return 'inactive';
        }

        if ($this->isExceeded()) {
            return 'exceeded';
        }

        if ($this->isAtAlertThreshold()) {
            return 'warning';
        }

        return 'healthy';
    }
}
