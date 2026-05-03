import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Wallet, Clock, Save, RotateCcw, Plus, Trash2, Zap } from 'lucide-react';
import { useFireStore } from '../store/useFireStore';
import { calculateFireProjection, calculateButterflyEffect } from '../utils/fireCalculations';

const Dashboard = () => {
  const { inputs, setInputs, scenarios, saveScenario, loadScenario, deleteScenario } = useFireStore();
  const [butterflyEffect, setButterflyEffect] = useState<number | null>(null);
  const [scenarioName, setScenarioName] = useState('');
  const results = calculateFireProjection(inputs);

  const handleExpenseChange = (prevValue: number, newValue: number) => {
    if (newValue < prevValue) {
      const diff = prevValue - newValue;
      const monthsSaved = calculateButterflyEffect(inputs, diff);
      setButterflyEffect(monthsSaved);
      setTimeout(() => setButterflyEffect(null), 5000);
    }
    setInputs({ monthlyExpenses: newValue });
  };

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (scenarioName.trim()) {
      saveScenario(scenarioName);
      setScenarioName('');
    }
  };

  const getBadge = () => {
    const rate = results.savingsRate;
    if (rate >= 60) return { label: 'Légende FIRE', color: 'text-yellow-400', icon: '👑' };
    if (rate >= 40) return { label: 'Sérieux', color: 'text-fire-400', icon: '🛡️' };
    if (rate >= 20) return { label: 'Savourer', color: 'text-blue-400', icon: '🌱' };
    return { label: 'Débutant', color: 'text-slate-400', icon: '🐣' };
  };

  const badge = getBadge();

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-fire-500/10 rounded-2xl text-fire-500">
            <Zap className="w-8 h-8" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">F.I.R.E. Engine</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
              <span className={`text-sm font-bold ${badge.color} flex items-center gap-1`}>
                {badge.icon} {badge.label}
              </span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
                Taux d'épargne: {results.savingsRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Chiffre F.I.R.E.</p>
            <p className="text-2xl font-mono font-bold text-fire-400">{results.fireNumber.toLocaleString()} €</p>
          </div>
          <div className="h-10 w-px bg-slate-800 mx-2" />
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Temps restant</p>
            <p className="text-2xl font-mono font-bold text-white">{results.yearsToFire} ans {results.monthsToFire % 12} mois</p>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-fire-600/20 to-transparent p-6 rounded-3xl border border-fire-500/20 flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-fire-500 rounded-full text-slate-950">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Votre capital actuel finance déjà :</p>
            <p className="text-3xl font-black text-white">
              {results.freedomDays.toLocaleString()} <span className="text-fire-400">jours de liberté</span>
            </p>
          </div>
        </div>
        <div className="hidden md:block text-right text-slate-500 text-xs italic max-w-xs">
          "Chaque euro épargné est un jour de liberté gagné pour votre futur soi."
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <Wallet className="text-fire-500 w-5 h-5" /> Paramètres
            </h2>
            <div className="space-y-4">
              <InputField label="Capital Actuel" value={inputs.currentCapital} onChange={(v) => setInputs({ currentCapital: v })} unit="€" />
              <InputField label="Revenu Mensuel" value={inputs.monthlyIncome} onChange={(v) => setInputs({ monthlyIncome: v })} unit="€" />
              <div className="relative">
                <InputField
                  label="Dépenses Mensuelles"
                  value={inputs.monthlyExpenses}
                  onChange={(v) => {
                    const prev = inputs.monthlyExpenses;
                    handleExpenseChange(prev, v);
                  }}
                  unit="€"
                />
                {butterflyEffect !== null && (
                  <div className="absolute -top-2 -right-2 bg-fire-500 text-slate-950 text-xs font-bold px-2 py-1 rounded-full animate-bounce shadow-lg">
                    -{butterflyEffect} mois ! 🦋
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Rendement (%)" value={inputs.annualReturnRate * 100} onChange={(v) => setInputs({ annualReturnRate: v / 100 })} unit="%" />
                <InputField label="Inflation (%)" value={inputs.annualInflationRate * 100} onChange={(v) => setInputs({ annualInflationRate: v / 100 })} unit="%" />
              </div>
            </div>
          </section>

          <section className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <Save className="text-fire-500 w-5 h-5" /> Scénarios
            </h2>
            <form onSubmit={handleSaveScenario} className="flex gap-2 mb-6">
              <input
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl py-2 px-4 text-white text-sm outline-none focus:ring-2 focus:ring-fire-500"
                placeholder="Nom du scénario..."
              />
              <button type="submit" className="bg-fire-500 text-slate-950 p-2 rounded-xl hover:bg-fire-400 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </form>
            <div className="space-y-3">
              {scenarios.length === 0 ? (
                <p className="text-slate-500 text-sm italic text-center">Aucun scénario sauvegardé.</p>
              ) : (
                scenarios.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700 group">
                    <span className="text-slate-300 text-sm font-medium cursor-pointer hover:text-white" onClick={() => loadScenario(s.id)}>
                      {s.name}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => loadScenario(s.id)} className="p-1 text-slate-500 hover:text-fire-400 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteScenario(s.id)} className="p-1 text-slate-500 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm text-center relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-slate-400 text-sm font-medium mb-4">Taux d'Épargne</h3>
               <div className="text-6xl font-black text-white mb-2">{results.savingsRate.toFixed(1)}%</div>
               <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                 results.savingsRate >= 50 ? 'bg-fire-500/20 text-fire-400' : 'bg-slate-800 text-slate-400'
               }`}>
                 {results.savingsRate >= 50 ? '🔥 Niveau Expert' : '🚀 En progression'}
               </div>
             </div>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-fire-500/10 rounded-full blur-3xl" />
          </section>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <section className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <TrendingUp className="text-fire-500 w-5 h-5" /> Projection de Croissance
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 bg-fire-500 rounded-full" /> Capital
                <span className="w-3 h-3 border-t border-dashed border-slate-500 rounded-full ml-2" /> Cible FIRE
              </div>
            </div>
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.projection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Années', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} itemStyle={{ color: '#22c55e' }} />
                  <ReferenceLine y={results.fireNumber} stroke="#64748b" strokeDasharray="5 5" label={{ value: 'FIRE NUMBER', position: 'right', fill: '#64748b', fontSize: 10 }} />
                  <Line type="monotone" dataKey="capital" stroke="#22c55e" strokeWidth={4} dot={false} animationDuration={1000} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, unit }: { label: string, value: number, onChange: (v: number) => void, unit: string }) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-fire-500 transition-all"
      />
      <span className="absolute right-4 top-2 text-slate-500 text-sm font-mono">{unit}</span>
    </div>
  </div>
);

export default Dashboard;
