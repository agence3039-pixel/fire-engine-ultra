import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FireInputs } from '../utils/fireCalculations';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
}

export interface LumpSumEvent {
  id: string;
  description: string;
  amount: number;
  year: number;
}

export interface Asset {
  id: string;
  name: string;
  amount: number;
  returnRate: number;
}

export interface Scenario {
  id: string;
  name: string;
  inputs: FireInputs;
  assets: Asset[];
}

interface FireState {
  inputs: FireInputs;
  transactions: Transaction[];
  lumpSumEvents: LumpSumEvent[];
  assets: Asset[];
  scenarios: Scenario[];
  setInputs: (inputs: Partial<<FireFireInputs>) => void;
  updateMonthlyExpense: (amount: number) => void;
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addLumpSumEvent: (event: LumpSumEvent) => void;
  deleteLumpSumEvent: (id: string) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, asset: Partial<<AssetAsset>) => void;
  deleteAsset: (id: string) => void;
  saveScenario: (name: string) => void;
  deleteScenario: (id: string) => void;
  loadScenario: (id: string) => void;
}

export const useFireStore = create<<FireFireState>()(
  persist(
    (set, get) => ({
      inputs: {
        currentCapital: 10000,
        monthlyIncome: 3000,
        monthlyExpenses: 1500,
        annualReturnRate: 0.06,
        annualInflationRate: 0.02,
      },
      transactions: [],
      lumpSumEvents: [],
      assets: [
        { id: '1', name: 'ETF World', amount: 10000, returnRate: 0.07 },
      ],
      scenarios: [],
      setInputs: (newInputs) =>
        set((state) => ({
          inputs: { ...state.inputs, ...newInputs }
        })),
      updateMonthlyExpense: (amount) =>
        set((state) => ({
          inputs: { ...state.inputs, monthlyExpenses: amount }
        })),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction]
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id)
        })),
      addLumpSumEvent: (event) =>
        set((state) => ({
          lumpSumEvents: [...state.lumpSumEvents, event]
        })),
      deleteLumpSumEvent: (id) =>
        set((state) => ({
          lumpSumEvents: state.lumpSumEvents.filter(e => e.id !== id)
        })),
      addAsset: (asset) =>
        set((state) => ({
          assets: [...state.assets, asset]
        })),
      updateAsset: (id, updatedAsset) =>
        set((state) => ({
          assets: state.assets.map(a => a.id === id ? { ...a, ...updatedAsset } : a)
        })),
      deleteAsset: (id) =>
        set((state) => ({
          assets: state.assets.filter(a => a.id !== id)
        })),
      saveScenario: (name) => {
        const { inputs, assets } = get();
        const newScenario: Scenario = {
          id: crypto.randomUUID(),
          name,
          inputs,
          assets
        };
        set((state) => ({ scenarios: [...state.scenarios, newScenario] }));
      },
      deleteScenario: (id) =>
        set((state) => ({
          scenarios: state.scenarios.filter(s => s.id !== id)
        })),
      loadScenario: (id) => {
        const scenario = get().scenarios.find(s => s.id === id);
        if (scenario) {
          set({ inputs: scenario.inputs, assets: scenario.assets });
        }
      },
    }),
    {
      name: 'fire-budget-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
