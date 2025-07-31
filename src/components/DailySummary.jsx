import React from 'react';
import { TrendingUp, Drumstick, Flame, Egg, Beef, Fish } from 'lucide-react';

const proteinSuggestions = [
  { key: 'frango_grelhado', label: 'Frango grelhado', icon: <Drumstick className="w-4 h-4 text-orange-500" /> },
  { key: 'ovo', label: 'Ovos', icon: <Egg className="w-4 h-4 text-yellow-500" /> },
  { key: 'salmao', label: 'Salmão', icon: <Fish className="w-4 h-4 text-blue-500" /> },
  { key: 'quinoa', label: 'Quinoa', icon: <Flame className="w-4 h-4 text-green-500" /> },
  { key: 'carne_vermelha', label: 'Carne vermelha magra', icon: <Beef className="w-4 h-4 text-red-700" />, fallback: { calories: 250, protein: 26, carbs: 0, fat: 15, per100g: true } }
];

const DailySummary = ({ totals, dailyGoals, goal, currentDate, addMealFromSuggestion }) => {
  const getProgressPercentage = (current, goal) => Math.min((current / goal) * 100, 100);
  const getProgressColor = (current, goal) => {
    const p = (current / goal) * 100;
    if (p < 80) return 'bg-red-500';
    if (p < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          Resumo Diário
        </h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">Progresso de hoje</p>
          <p className="text-lg font-semibold text-gray-800">
            {Math.round(((totals.calories + totals.protein + totals.carbs + totals.fat) / (dailyGoals.calories + dailyGoals.protein + dailyGoals.carbs + dailyGoals.fat)) * 100)}%
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { key: 'calories', label: 'Calorias', icon: '🔥', color: '#ef4444' },
          { key: 'protein', label: 'Proteína', icon: '🥩', color: '#3b82f6' },
          { key: 'carbs', label: 'Carboidratos', icon: '🍞', color: '#22c55e' },
          { key: 'fat', label: 'Gorduras', icon: '🥑', color: '#eab308' }
        ].map(({ key, label, icon, color }) => {
          const percentage = getProgressPercentage(totals[key], dailyGoals[key]);
          const isComplete = percentage >= 100;
          
          return (
            <div key={key} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    stroke="#e5e7eb" 
                    strokeWidth="8" 
                    fill="none" 
                  />
                  <circle
                    cx="40" 
                    cy="40" 
                    r="32"
                    stroke={color}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - percentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg mb-1">{icon}</div>
                    <div className="text-xs font-bold text-gray-700">{Math.round(percentage)}%</div>
                  </div>
                </div>
                {isComplete && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-gentle">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">{totals[key]}</span>
                  <span className="text-gray-400"> / {dailyGoals[key]}</span>
                  <span className="text-gray-400">{key === 'calories' ? '' : 'g'}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {dailyGoals.summary && (
        <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
          <p className="text-sm font-medium flex items-center gap-2">
            <Flame className="w-4 h-4" /> {dailyGoals.summary}
          </p>
        </div>
      )}

      {goal === 'muscle' && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Adicionar alimento rico em proteína:</h3>
          <ul className="grid grid-cols-2 gap-2">
            {proteinSuggestions.map(({ key, label, icon, fallback }) => (
              <li key={key}>
                <button
                  className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 rounded-lg px-2 py-1 hover:bg-gray-200 transition"
                  onClick={() => addMealFromSuggestion(key, label, fallback)}
                >
                  {icon} {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DailySummary;
