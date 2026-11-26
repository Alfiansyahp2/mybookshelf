<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property string $id
 * @property string $user_id
 * @property string|null $expense_id
 * @property string|null $budget_id
 * @property string $type
 * @property \Illuminate\Support\Carbon $event_date
 * @property string $description
 * @property array<array-key, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Budget|null $budget
 * @property-read \App\Models\Expense|null $expense
 * @property-read string $formatted_date
 * @property-read string $type_label
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent byType($type)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent forUser($userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent inPeriod($startDate, $endDate)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent recent($days = 30)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent whereBudgetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent whereEventDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent whereExpenseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountingTimelineEvent whereUserId($value)
 */
	class AccountingTimelineEvent extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $title
 * @property string $description
 * @property string $icon
 * @property int $requirement
 * @property string $category
 * @property string $rarity
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement whereRarity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement whereRequirement($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Achievement whereUpdatedAt($value)
 */
	class Achievement extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $user_id
 * @property string|null $shelf_id
 * @property string $title
 * @property string $author
 * @property string|null $isbn
 * @property string $genre
 * @property string $language
 * @property string|null $publisher
 * @property int|null $publish_year
 * @property int $pages
 * @property string $format
 * @property string $height
 * @property string $thickness
 * @property string $status
 * @property string $spine_color_light
 * @property string $spine_color_medium
 * @property string $spine_color_dark
 * @property string|null $cover_image
 * @property int $position
 * @property bool $favorite
 * @property int|null $current_page
 * @property numeric $progress
 * @property \Illuminate\Support\Carbon|null $started_date
 * @property \Illuminate\Support\Carbon|null $finished_date
 * @property \Illuminate\Support\Carbon|null $estimated_start_date
 * @property string|null $borrowed_by
 * @property \Illuminate\Support\Carbon|null $borrowed_date
 * @property \Illuminate\Support\Carbon|null $due_date
 * @property bool $is_returned
 * @property string|null $personal_notes
 * @property numeric|null $personal_rating
 * @property \Illuminate\Support\Carbon|null $purchase_date
 * @property numeric|null $purchase_price
 * @property string|null $purchase_location
 * @property \Illuminate\Support\Carbon $date_added
 * @property \Illuminate\Support\Carbon $last_modified
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property array<array-key, mixed>|null $read_dates
 * @property string|null $purchase_currency
 * @property bool $is_gift
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Collection> $collections
 * @property-read int|null $collections_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Expense> $expenses
 * @property-read int|null $expenses_count
 * @property-read array $spine_colors
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ReadingSession> $readingSessions
 * @property-read int|null $reading_sessions_count
 * @property-read \App\Models\Shelf|null $shelf
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TimelineEvent> $timelineEvents
 * @property-read int|null $timeline_events_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book favorite()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereAuthor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereBorrowedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereBorrowedDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereCoverImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereCurrentPage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereDateAdded($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereEstimatedStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereFavorite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereFinishedDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereFormat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereGenre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereHeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereIsGift($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereIsReturned($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereIsbn($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereLastModified($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book wherePages($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book wherePersonalNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book wherePersonalRating($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book wherePosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereProgress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book wherePublishYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book wherePublisher($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book wherePurchaseCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book wherePurchaseDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book wherePurchaseLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book wherePurchasePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereReadDates($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereShelfId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereSpineColorDark($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereSpineColorLight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereSpineColorMedium($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereStartedDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereThickness($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book withStatus($status)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Book withoutTrashed()
 */
	class Book extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $user_id
 * @property string|null $category_id
 * @property string $name
 * @property string|null $description
 * @property numeric $amount
 * @property string $currency
 * @property numeric $amount_base_currency
 * @property string $period
 * @property \Illuminate\Support\Carbon $start_date
 * @property \Illuminate\Support\Carbon|null $end_date
 * @property numeric $alert_threshold
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\ExpenseCategory|null $category
 * @property-read string $formatted_amount
 * @property-read string $formatted_remaining
 * @property-read string $formatted_spent
 * @property-read float $remaining_amount
 * @property-read string $status
 * @property-read float $total_spent
 * @property-read float $usage_percentage
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget byPeriod($period)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget current()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget forUser($userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereAlertThreshold($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereAmountBaseCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget wherePeriod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget withoutTrashed()
 */
	class Budget extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string|null $description
 * @property string $color
 * @property string|null $icon
 * @property numeric $progress
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Book> $books
 * @property-read int|null $books_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection whereProgress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Collection withoutTrashed()
 */
	class Collection extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $from_currency
 * @property string $to_currency
 * @property numeric $rate
 * @property \Illuminate\Support\Carbon $effective_date
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $formatted_rate
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate forPair($fromCurrency, $toCurrency = 'IDR')
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate whereEffectiveDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate whereFromCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate whereRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate whereToCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyRate whereUpdatedAt($value)
 */
	class CurrencyRate extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $user_id
 * @property string|null $book_id
 * @property string $title
 * @property string|null $description
 * @property numeric $amount
 * @property string $currency
 * @property numeric $amount_base_currency
 * @property numeric $exchange_rate
 * @property string|null $category_id
 * @property string $payment_method
 * @property \Illuminate\Support\Carbon $expense_date
 * @property bool $is_recurring
 * @property string|null $recurring_period
 * @property string|null $parent_expense_id
 * @property string|null $vendor
 * @property string|null $location
 * @property string|null $receipt_data
 * @property string|null $receipt_mime_type
 * @property string|null $receipt_filename
 * @property bool $has_reminder
 * @property \Illuminate\Support\Carbon|null $reminder_date
 * @property bool $reminder_sent
 * @property string $status
 * @property array<array-key, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Book|null $book
 * @property-read \App\Models\ExpenseCategory|null $category
 * @property-read string $formatted_amount
 * @property-read string $formatted_base_amount
 * @property-read Expense|null $parentExpense
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Expense> $recurringExpenses
 * @property-read int|null $recurring_expenses_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense byPaymentMethod($method)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense byStatus($status)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense completed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense forUser($userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense inPeriod($startDate, $endDate)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereAmountBaseCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereBookId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereExchangeRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereExpenseDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereHasReminder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereIsRecurring($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereParentExpenseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereReceiptData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereReceiptFilename($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereReceiptMimeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereRecurringPeriod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereReminderDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereReminderSent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense whereVendor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Expense withoutTrashed()
 */
	class Expense extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string|null $description
 * @property string $color
 * @property string|null $icon
 * @property bool $is_default
 * @property numeric|null $monthly_budget
 * @property string $budget_currency
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Budget> $budgets
 * @property-read int|null $budgets_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Expense> $expenses
 * @property-read int|null $expenses_count
 * @property-read float $budget_usage_percentage
 * @property-read string $formatted_budget
 * @property-read float $total_expenses
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory custom()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory default()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory forUser($userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereBudgetCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereIsDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereMonthlyBudget($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExpenseCategory withoutTrashed()
 */
	class ExpenseCategory extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $book_id
 * @property \Illuminate\Support\Carbon $start_time
 * @property \Illuminate\Support\Carbon|null $end_time
 * @property int $start_page
 * @property int|null $end_page
 * @property int|null $duration
 * @property string|null $mood
 * @property string|null $location
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $user_id
 * @property bool $is_paused
 * @property int $paused_seconds
 * @property string|null $last_paused_at
 * @property-read \App\Models\Book|null $book
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereBookId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereEndPage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereIsPaused($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereLastPausedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereMood($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession wherePausedSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereStartPage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReadingSession whereUserId($value)
 */
	class ReadingSession extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $room_id
 * @property string $name
 * @property int $capacity
 * @property int $order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $user_id
 * @property int $span
 * @property array<array-key, mixed>|null $decorations
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Book> $books
 * @property-read int|null $books_count
 * @property-read array $occupancy
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf whereDecorations($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf whereOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf whereRoomId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf whereSpan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Shelf whereUserId($value)
 */
	class Shelf extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $book_id
 * @property string $type
 * @property \Illuminate\Support\Carbon $date
 * @property string $description
 * @property array<array-key, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Book|null $book
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimelineEvent newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimelineEvent newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimelineEvent query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimelineEvent whereBookId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimelineEvent whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimelineEvent whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimelineEvent whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimelineEvent whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimelineEvent whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimelineEvent whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimelineEvent whereUpdatedAt($value)
 */
	class TimelineEvent extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Achievement> $achievements
 * @property-read int|null $achievements_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Book> $books
 * @property-read int|null $books_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Collection> $collections
 * @property-read int|null $collections_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

