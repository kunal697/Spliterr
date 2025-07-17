# Spliterr - Expense Splitting App

## 🔧 Tech Stack
- **Frontend**: React.js, Context API, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Other**: REST API, Modular Component Design

### 🔹 Frontend (`/client`)
```
/src
├── api/
│   └── index.js                # All fetch-based API utility functions
├── context/
│   └── ExpenseContext.jsx      # Global context for expenses and settlements
├── components/
│   ├── AddExpenseForm.jsx      # Modal to add new expenses
│   ├── ExpenseList.jsx         # Lists all expenses with delete functionality
│   ├── BalancesView.jsx        # Card view showing who owes whom
│   ├── SettlementSummary.jsx   # Simplified settlement logic display
│   ├── Header.jsx              # App header with theme toggle & add button
│   └── LoadingSpinner.jsx      # Spinner shown while data is loading
├── pages/
│   └── HomePage.jsx            # Main layout combining all components
└── App.jsx                     # Root app file with context provider
```

### 🔹 Backend (`/server`)
```
/server
├── controllers/
│   ├── expenseController.js      # Handles expense creation, fetching, deletion
│   └── analyticsController.js    # Computes balances and settlements
├── models/
│   └── Expense.js                # Mongoose model for expense data
├── routes/
│   ├── expenseRoutes.js          # /api/expenses routes
│   └── analyticsRoutes.js        # /api/analytics routes
├── config/
│   └── db.js                     # MongoDB connection setup
└── server.js                     # Express app entry point
```

## Postman Collection : 
https://www.postman.com/kunalb697/public/collection/pm5u1sb/spliterr-api?action=share&creator=37054610

## Live Link : 
https://heroic-halva-06a7c9.netlify.app/

---

## Settlement Calculation Logic

### `calculateBalances(expenses)`

This function calculates how much each person owes or is owed.

* Adds the full amount to the person who paid (`paid_by`).
* Subtracts each person's share based on `split_type`:

  * **equal**: splits amount equally among `shared_with`.
  * **percentage**: splits amount using `split_values` as percentages.
  * **exact**: splits amount using exact values from `split_values`.
* Final balance:

  * Positive → person is owed money.
  * Negative → person owes money.

---

### `simplifySettlements(balances)`

This function converts balances into direct settlements.

* Separates people into debtors (owe money) and creditors (are owed money).
* Matches debtors to creditors with minimum transactions.
* Example:

  ```
  { A: 60, B: -40, C: -20 } 
  → B pays A 40, C pays A 20
  ```

---

## Assumptions and Limitations

* Results are rounded to 2 decimal places to avoid floating point issues.
* Assumes that `split_values.length` matches `shared_with.length`.
* The payer can be included in the `shared_with` array.
* Input validation is assumed to be done before calling this function.

---




## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/kunal697/spliterr.git
cd spliterr
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `/server` with the following:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📦 API Endpoints

### Expense Routes (`/api/expenses`)
- `GET /api/expenses` — Fetch all expenses
- `POST /api/expenses` — Add a new expense
- `DELETE /api/expenses/:id` — Delete a specific expense

### Analytics Routes (`/api/analytics`)
- `GET /api/analytics/balances` — Get current balances between users
- `GET /api/analytics/settlements` — Get simplified settlement transactions

## 🧪 Sample .env file
```env
# Backend .env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/spliterr?retryWrites=true&w=majority
```
