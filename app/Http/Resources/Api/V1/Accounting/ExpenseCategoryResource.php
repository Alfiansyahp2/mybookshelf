<?php

namespace App\Http\Resources\Api\V1\Accounting;

use App\Http\Resources\Api\V1\Concerns\FormatsDates;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseCategoryResource extends JsonResource
{
    use FormatsDates;

    /**
     * Transform an expense category model into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $totalExpenses = $this->relationLoaded('expenses')
            ? (float) $this->expenses->sum('amount_base_currency')
            : $this->getTotalExpensesAttribute();

        $monthlyBudget = $this->monthly_budget ? (float) $this->monthly_budget : null;
        $usagePercentage = ($monthlyBudget && $monthlyBudget > 0)
            ? ($totalExpenses / $monthlyBudget) * 100
            : 0;

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'description' => $this->description,
            'color' => $this->color,
            'icon' => $this->icon,
            'is_default' => (bool) $this->is_default,
            'monthly_budget' => $this->monthly_budget,
            'budget_currency' => $this->budget_currency,
            'total_expenses' => $totalExpenses,
            'budget_usage_percentage' => $usagePercentage,
            'is_budget_exceeded' => $usagePercentage > 100,
            'is_near_threshold' => $usagePercentage >= 80.0 && $usagePercentage <= 100,
            'formatted_budget' => $this->formatted_budget,
            'expenses' => ExpenseResource::collection($this->whenLoaded('expenses')),
            'budgets' => BudgetResource::collection($this->whenLoaded('budgets')),
            'created_at' => $this->toIso8601($this->created_at),
            'updated_at' => $this->toIso8601($this->updated_at),
            'deleted_at' => $this->toIso8601($this->deleted_at),
        ];
    }
}
