const calculateBalances = (expenses) => {
  const balances = {};

  for (const exp of expenses) {
    const { amount, paid_by, shared_with, split_type, split_values } = exp;

    // Add payer
    if (!balances[paid_by]) balances[paid_by] = 0;
    balances[paid_by] += amount;

    // Handle splits
    if (split_type === "equal") {
      const share = amount / shared_with.length;
      shared_with.forEach(person => {
        if (!balances[person]) balances[person] = 0;
        balances[person] -= share;
      });
    }

    if (split_type === "percentage") {
      shared_with.forEach((person, i) => {
        const share = (split_values[i] / 100) * amount;
        if (!balances[person]) balances[person] = 0;
        balances[person] -= share;
      });
    }

    if (split_type === "exact") {
      shared_with.forEach((person, i) => {
        const share = split_values[i];
        if (!balances[person]) balances[person] = 0;
        balances[person] -= share;
      });
    }
  }

  // Round to 2 decimals to avoid floating point bugs
  for (const person in balances) {
    balances[person] = Number(balances[person].toFixed(2));
  }

  return balances;
};

const simplifySettlements = (balances) => {
  const debtors = [];
  const creditors = [];

  for (const person in balances) {
    const amount = balances[person];
    if (amount < 0) debtors.push({ person, amount: -amount });
    else if (amount > 0) creditors.push({ person, amount });
  }

  const settlements = [];

  while (debtors.length && creditors.length) {
    const debtor = debtors[0];
    const creditor = creditors[0];

    const paidAmount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.person,
      to: creditor.person,
      amount: Number(paidAmount.toFixed(2)),
    });

    debtor.amount -= paidAmount;
    creditor.amount -= paidAmount;

    if (debtor.amount === 0) debtors.shift();
    if (creditor.amount === 0) creditors.shift();
  }

  return settlements;
};

module.exports = {
  calculateBalances,
  simplifySettlements,
};
