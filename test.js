function getRandomDateWithinLastWeek() {
  // Get the current date
  const currentDate = new Date();

  // Get a random number of days to subtract (from 0 to 6)
  const daysToSubtract = Math.floor(Math.random() * 7);

  // Subtract random days to get a date within the last week
  const randomDate = new Date(currentDate);
  randomDate.setDate(currentDate.getDate() - daysToSubtract);

  return randomDate.toISOString().split("T")[0]; // Returns in YYYY-MM-DD format
}

function getRandomAmount() {
  return (Math.random() * 500).toFixed(2); // Random amount between 0 and 500
}

function getRandomName() {
  const names = [
    "groceries",
    "transportation",
    "utilities",
    "entertainment",
    "dining",
    "clothing",
    "miscellaneous",
  ];
  return names[Math.floor(Math.random() * names.length)];
}

// Generate 20 random expense objects
const expenses = [];

for (let i = 0; i < 20; i++) {
  expenses.push({
    date: getRandomDateWithinLastWeek(),
    name: getRandomName(),
    amount: getRandomAmount(),
  });
}

console.log(expenses);
