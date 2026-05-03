export interface FireInputs {
  currentCapital: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  annualReturnRate: number;
  annualInflationRate: number;
}

export interface LumpSumEvent {
  id: string;
  description: string;
  amount: number;
  year: number;
}

export interface FireResults {
  fireNumber: number;
  savingsRate: number;
  monthlySavings: number;
  yearsToFire: number;
  monthsToFire: number;
  projection: { year: number; capital: number }[];
  freedomDays: number;
}

export const calculateFireNumber = (monthlyExpenses: number): number => monthlyExpenses * 12 * 25;

export const calculateSavingsRate = (income: number, expenses: number): number => {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
};

export const calculateFireProjection = (
  inputs: FireInputs,
  lumpSumEvents: LumpSumEvent[] = []
): FireResults => {
  const { currentCapital, monthlyIncome, monthlyExpenses, annualReturnRate, annualInflationRate } = inputs;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = calculateSavingsRate(monthlyIncome, monthlyExpenses);
  const monthlyRate = annualReturnRate / 12;
  const monthlyInflation = annualInflationRate / 12;

  let currentCapitalAccumulated = currentCapital;
  let currentMonthlyExpenses = monthlyExpenses;
  let months = 0;
  const projection: { year: number; capital: number }[] = [{ year: 0, capital: currentCapital }];

  while (months <<  600) {
    currentCapitalAccumulated = currentCapitalAccumulated * (1 + monthlyRate) + monthlySavings;
    currentMonthlyExpenses = currentMonthlyExpenses * (1 + monthlyInflation);
    months++;

    if (months > 0 && months % 12 === 0) {
      const year = months / 12;
      const eventsThisYear = lumpSumEvents.filter(e => e.year === year);
      eventsThisYear.forEach(e => { currentCapitalAccumulated += e.amount; });
      projection.push({ year, capital: Math.round(currentCapitalAccumulated) });
    }

    if (currentCapitalAccumulated >= calculateFireNumber(currentMonthlyExpenses)) break;
  }

  return {
    fireNumber: calculateFireNumber(currentMonthlyExpenses),
    savingsRate,
    monthlySavings,
    yearsToFire: Math.floor(months / 12),
    monthsToFire: months,
    projection,
    freedomDays: Math.floor(currentCapital / (monthlyExpenses / 30)),
  };
};

export const calculateButterflyEffect = (
  currentInputs: FireInputs,
  monthlySavingAdded: number,
  lumpSumEvents: LumpSumEvent[] = []
): number => {
  const original = calculateFireProjection(currentInputs, lumpSumEvents);
  const updated = calculateFireProjection({ ...currentInputs, monthlyExpenses: currentInputs.monthlyExpenses - monthlySavingAdded }, lumpSumEvents);
  return original.monthsToFire - updated.monthsToFire;
};
