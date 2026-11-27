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

class Expense extends Model
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
        'book_id',
        'title',
        'description',
        'amount',
        'currency',
        'amount_base_currency',
        'exchange_rate',
        'category_id',
        'payment_method',
        'expense_date',
        'is_recurring',
        'recurring_period',
        'parent_expense_id',
        'vendor',
        'location',
        'receipt_data',
        'receipt_mime_type',
        'receipt_filename',
        'receipt_path',
        'has_reminder',
        'reminder_date',
        'reminder_sent',
        'status',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'amount_base_currency' => 'decimal:2',
        'exchange_rate' => 'decimal:6',
        'expense_date' => 'datetime',
        'reminder_date' => 'datetime',
        'is_recurring' => 'boolean',
        'has_reminder' => 'boolean',
        'reminder_sent' => 'boolean',
        'metadata' => 'array',
    ];

    /**
     * Get the user that owns the expense.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the book associated with the expense.
     *
     * @return BelongsTo<Book, $this>
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Get the category that owns the expense.
     *
     * @return BelongsTo<ExpenseCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ExpenseCategory::class, 'category_id');
    }

    /**
     * Get the parent expense for recurring expenses.
     *
     * @return BelongsTo<Expense, $this>
     */
    public function parentExpense(): BelongsTo
    {
        return $this->belongsTo(Expense::class, 'parent_expense_id');
    }

    /**
     * Get the recurring expenses generated from this expense.
     *
     * @return HasMany<Expense, $this>
     */
    public function recurringExpenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'parent_expense_id');
    }

    /**
     * Scope to only include expenses for a specific user.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeForUser(Builder $query, string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by payment method.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeByPaymentMethod(Builder $query, string $method): Builder
    {
        return $query->where('payment_method', $method);
    }

    /**
     * Scope to filter by status.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by date range.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeInPeriod(Builder $query, mixed $startDate, mixed $endDate): Builder
    {
        return $query->whereBetween('expense_date', [$startDate, $endDate]);
    }

    /**
     * Scope to only include completed expenses.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', 'completed');
    }

    /**
     * Check if expense has a receipt.
     */
    public function hasReceipt(): bool
    {
        return ! empty($this->receipt_path) || ! empty($this->receipt_data);
    }

    /**
     * Get the formatted amount with currency.
     */
    public function getFormattedAmountAttribute(): string
    {
        return number_format((float) $this->amount, 2, ',', '.').' '.$this->currency;
    }

    /**
     * Get the formatted base currency amount.
     */
    public function getFormattedBaseAmountAttribute(): string
    {
        return number_format((float) $this->amount_base_currency, 2, ',', '.').' IDR';
    }
}
