# MyBookshelf Accounting System - User Guide

Complete guide for using the Advanced Full Accounting System in MyBookshelf.

## 🚀 Getting Started

### Access the Accounting System

1. **Navigate to Accounting Page**
   - Go to `/accounting` in your MyBookshelf app
   - Or click "View All" in the dashboard accounting widget

2. **Initial Setup**
   - You'll see 4 main tabs: Overview, Expenses, Budgets, Categories
   - Start with Categories tab to set up your expense categories

---

## 📁 Managing Categories

### Default Categories

The system comes with 5 pre-configured categories:

1. **📚 Book Purchases** - Novel, fiction, non-fiction books (Budget: Rp 500.000)
2. **📦 Shipping & Handling** - Delivery costs (Budget: Rp 100.000)  
3. **🔧 Book Maintenance** - Care and accessories (Budget: Rp 50.000)
4. **🎁 Gifts & Donations** - Books as gifts (Budget: Rp 200.000)
5. **📝 Other Expenses** - Miscellaneous book expenses (Budget: Rp 100.000)

### Creating Custom Categories

1. Go to **Categories** tab
2. Click **Add Category**
3. Fill in the details:
   - **Name**: Category name (e.g., "Magazines")
   - **Description**: What this category covers
   - **Color**: Pick a color for visual identification
   - **Icon**: Choose an emoji icon
   - **Monthly Budget**: Set spending limit
4. Click **Save**

### Editing Categories

1. Click on any category card
2. Modify the fields
3. Click **Update Category**

### Category Statistics

Each category shows:
- **Total Expenses**: Sum of all expenses in this category
- **Budget Usage**: Percentage of budget used
- **Expense Count**: Number of transactions
- **Recent Expenses**: Latest 5 expenses

---

## 💰 Managing Expenses

### Adding a New Expense

1. Go to **Expenses** tab
2. Click **Add Expense** button
3. Fill in expense details:

#### Required Fields:
- **Title**: Name of the expense (e.g., "Buku 'Atomic Habits'")
- **Amount**: Cost in your currency
- **Currency**: Select currency (default: IDR)

#### Optional Fields:
- **Description**: Details about the expense
- **Category**: Select appropriate category
- **Payment Method**: cash, transfer, e-wallet, credit_card
- **Expense Date**: When the expense occurred
- **Book**: Link to a specific book in your library
- **Vendor**: Where you purchased (e.g., "Gramedia")
- **Location**: Purchase location
- **Receipt**: Upload receipt image
- **Is Recurring**: For regular payments
- **Has Reminder**: Set payment reminder

4. Click **Save Expense**

### Expense Features

#### Receipt Upload
- Click on any expense
- Choose **Upload Receipt**
- Select image file (JPG, PNG)
- Receipt is stored as base64 data

#### Currency Conversion
- If you purchase in foreign currency
- System automatically converts to IDR
- Uses current exchange rates
- Both amounts are stored for reference

#### Recurring Expenses
- For regular payments (subscriptions, etc.)
- Set recurrence period: daily, weekly, monthly, yearly
- System automatically generates new instances
- Set reminders for due dates

#### Duplicate Expense
- Click on expense → **Duplicate**
- Creates copy with "(Copy)" suffix
- Useful for similar repeated expenses

### Managing Expenses

#### View & Filter
- **All Expenses**: See complete list
- **By Category**: Filter using category dropdown
- **By Payment Method**: Filter how you paid
- **By Status**: pending, completed, cancelled
- **By Date Range**: Set custom date range
- **By Book**: See expenses for specific book

#### Bulk Actions
- **Export**: Export filtered expenses to CSV/Excel
- **Mark as Paid**: Change status from pending to completed
- **Bulk Delete**: Remove multiple expenses

---

## 💸 Managing Budgets

### Creating a Budget

1. Go to **Budgets** tab
2. Click **Add Budget**
3. Fill in budget details:

#### Required Fields:
- **Name**: Budget name (e.g., "Monthly Book Budget")
- **Amount**: Total budget amount
- **Period**: daily, weekly, monthly, yearly
- **Start Date**: When budget period begins

#### Optional Fields:
- **Category**: Link to specific expense category
- **End Date**: When budget period ends
- **Alert Threshold**: % for budget alerts (default: 80%)
- **Description**: What this budget covers

4. Click **Save Budget**

### Budget Tracking

Each budget shows:
- **Budget Amount**: Total allocated amount
- **Total Spent**: How much you've used
- **Remaining Amount**: Budget left
- **Usage Percentage**: % of budget used
- **Status**: healthy, warning, exceeded

#### Budget Status:
- **🟢 Healthy**: Under alert threshold
- **🟡 Warning**: Approaching limit (at threshold %)
- **🔴 Exceeded**: Over budget

### Budget Alerts

Automatic alerts when:
- Budget exceeds 100% (🔴)
- Budget reaches alert threshold (🟡)
- Budget has 3 days or less remaining

Alerts appear as:
- Dashboard notifications
- Budget status indicators
- Timeline events

### Budget Management

#### Reset Period
- For recurring budgets
- Click budget → **Reset Period**
- Automatically calculates next period dates

#### Performance Trends
- See spending patterns over time
- Daily breakdown of expenses
- Identify spending spikes

---

## 💱 Currency Management

### Supported Currencies

- **IDR** - Indonesian Rupiah (Rp) - Base Currency
- **USD** - US Dollar ($)
- **EUR** - Euro (€)
- **GBP** - British Pound (£)
- **JPY** - Japanese Yen (¥)
- **SGD** - Singapore Dollar (S$)
- **AUD** - Australian Dollar (A$)
- **CNY** - Chinese Yuan (¥)
- **MYR** - Malaysian Ringgit (RM)
- **THB** - Thai Baht (฿)

### Managing Exchange Rates

#### View Current Rates
- Go to any expense with foreign currency
- See both original and converted amounts
- Check exchange rate used

#### Manual Rate Entry
1. Go to **Settings** → **Currency Rates**
2. Click **Add Rate**
3. Enter:
   - **From Currency**: Currency to convert from
   - **To Currency**: Currency to convert to (usually IDR)
   - **Rate**: Exchange rate (e.g., 15000 for USD→IDR)
   - **Effective Date**: When rate becomes active
4. Click **Save**

#### Live Rate Sync
- Click **Sync Live Rates**
- System fetches current rates
- Updates all active rates
- Sets expiry to end of day

#### Currency Converter
- Use built-in converter
- Enter amount and currencies
- See instant conversion
- Check historical rates

---

## 📊 Reports & Analytics

### Overview Dashboard

Main dashboard shows:
- **Total Expenses**: Sum of all expenses
- **Budget Status**: Active budgets overview
- **Monthly Comparison**: vs last month
- **Pending Expenses**: Awaiting payment
- **Recent Transactions**: Latest 10 expenses
- **Top Categories**: Highest spending categories
- **Budget Alerts**: Active alerts

### Detailed Reports

#### Expenses by Category
- Breakdown by category
- Visual bar charts
- Expense counts per category

#### Expenses by Period
- Daily, weekly, monthly, yearly views
- Group expenses by time period
- Trend analysis

#### Payment Methods Analysis
- See spending patterns by payment type
- Cash vs digital spending
- Most used payment methods

#### Monthly Comparison
- Compare up to 12 months
- See spending trends
- Identify seasonal patterns

#### Year-to-Date Summary
- Total year spending
- Monthly average
- Projected yearly total
- Year-over-year comparison

### Export Reports

1. Go to **Reports** tab
2. Choose report type
3. Set date range
4. Select format: JSON, CSV, Excel, PDF
5. Click **Export**

---

## 🔔 Notifications & Reminders

### Budget Alerts
- **Push Notifications**: Real-time alerts
- **Dashboard Widgets**: Overview widgets
- **Email Notifications**: (Optional)

### Payment Reminders
- **Expense Reminders**: For pending payments
- **Recurring Reminders**: For recurring expenses
- **Budget Warnings**: When approaching limits

### Timeline Events
All activities logged in timeline:
- Expense created/updated
- Budget exceeded/alert
- Payment reminders
- Currency rate updates

---

## 🎯 Tips & Best Practices

### Expense Tracking
1. **Be Specific**: Use detailed descriptions
2. **Categorize Properly**: Choose correct categories
3. **Link to Books**: Connect expenses to specific books
4. **Upload Receipts**: Keep digital records
5. **Set Reminders**: For recurring expenses

### Budget Management
1. **Set Realistic Budgets**: Based on actual spending
2. **Use Alerts**: Set appropriate thresholds (70-80%)
3. **Review Regularly**: Check budget status weekly
4. **Adjust Periods**: Monthly budgets work best
5. **Track Categories**: Separate budgets by category

### Currency Management
1. **Sync Rates**: Update exchange rates regularly
2. **Use Base Currency**: Store everything in IDR
3. **Check Conversions**: Verify foreign amounts
4. **Monitor Fluctuations**: Currency rate changes affect totals

---

## 🔧 Advanced Features

### Recurring Expenses
- **Subscriptions**: Magazine subscriptions, book clubs
- **Regular Payments**: Monthly book boxes
- **Automatic Generation**: New instances created automatically
- **Parent-Child**: Parent expense with generated instances

### Multi-Currency Support
- **Automatic Conversion**: Foreign currency → IDR
- **Historical Rates**: Track rate changes over time
- **Dual Display**: See both currencies
- **Rate Management**: Manual or automatic updates

### Analytics & Insights
- **Spending Patterns**: Identify trends
- **Category Analysis**: See where money goes
- **Budget Performance**: Track adherence
- **Payment Habits**: Cash vs digital

---

## 📱 Mobile Usage

### Responsive Design
- Works on all screen sizes
- Touch-friendly interface
- Mobile-optimized charts

### Quick Actions
- **Add Expense**: Quick expense entry
- **Check Budgets**: Budget status at a glance
- **View Alerts**: Immediate notifications

---

## 🛠️ Troubleshooting

### Common Issues

#### Budget Showing Wrong Amount
- Check expense categorization
- Verify budget date range
- Ensure expenses are marked "completed"

#### Missing Categories
- Initialize default categories
- Create custom categories
- Check category assignments

#### Currency Conversion Issues
- Update exchange rates
- Check rate validity dates
- Verify currency codes

#### Expenses Not Showing
- Check date filters
- Verify expense status
- Ensure correct user account

### Data Issues

#### Reset Sample Data
```bash
php artisan migrate:rollback --step=1
php artisan migrate
```

#### Reinitialize Categories
1. Go to Categories tab
2. Click "Initialize Defaults"
3. Verify 5 categories created

#### Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

---

## 📞 Support

For issues or questions:
1. Check API documentation: `ACCOUNTING_API_DOCUMENTATION.md`
2. Review database structure in migrations
3. Check frontend console for errors
4. Verify API responses in browser DevTools

---

## 🎉 Getting Most Out of System

### Daily Usage
- Add expenses as they occur
- Check budget status
- Review pending expenses

### Weekly Usage  
- Review spending by category
- Check budget progress
- Update currency rates

### Monthly Usage
- Analyze spending trends
- Adjust budgets as needed
- Generate monthly reports
- Export data for records

### Best Practices
1. **Consistency**: Track everything
2. **Accuracy**: Use exact amounts
3. **Timeliness**: Enter expenses immediately
4. **Review**: Check reports regularly
5. **Adjust**: Update budgets as needed

---

Enjoy managing your book expenses with MyBookshelf Accounting System! 📚💰