<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExpenseCategory extends Model
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
        'name',
        'description',
        'color',
        'icon',
        'is_default',
        'monthly_budget',
        'budget_currency',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'monthly_budget' => 'decimal:2',
        'is_default' => 'boolean',
    ];

    /**
     * Get the user that owns the category.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the expenses for the category.
     *
     * @return HasMany<Expense, $this>
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'category_id');
    }

    /**
     * Get the budgets for the category.
     *
     * @return HasMany<Budget, $this>
     */
    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class, 'category_id');
    }

    /**
     * Scope to only include categories for a specific user.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeForUser(Builder $query, string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to only include default categories.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeDefault(Builder $query): Builder
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope to only include custom categories.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeCustom(Builder $query): Builder
    {
        return $query->where('is_default', false);
    }

    /**
     * Get total expenses for this category.
     */
    public function getTotalExpensesAttribute(): float
    {
        return (float) $this->expenses()->sum('amount_base_currency');
    }

    /**
     * Get formatted monthly budget.
     */
    public function getFormattedBudgetAttribute(): string
    {
        if (! $this->monthly_budget) {
            return 'Not set';
        }

        return number_format((float) $this->monthly_budget, 2, ',', '.').' '.$this->budget_currency;
    }

    /**
     * Get budget usage percentage.
     */
    public function getBudgetUsagePercentageAttribute(): float
    {
        if (! $this->monthly_budget || (float) $this->monthly_budget <= 0) {
            return 0;
        }

        $totalExpenses = $this->getTotalExpensesAttribute();

        return ($totalExpenses / (float) $this->monthly_budget) * 100;
    }

    /**
     * Check if budget is exceeded.
     */
    public function isBudgetExceeded(): bool
    {
        return $this->getBudgetUsagePercentageAttribute() > 100;
    }

    /**
     * Check if budget is near threshold (default 80%).
     */
    public function isNearThreshold(float $threshold = 80.0): bool
    {
        $usage = $this->getBudgetUsagePercentageAttribute();

        return $usage >= $threshold && $usage <= 100;
    }
}
