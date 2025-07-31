import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CalendarDays } from 'lucide-react';

const WeeklyDashboard = ({ history }) => {
  const getDateLabel = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric' });
  };

  const chartData = history.map(entry => ({
    name: getDateLabel(entry.date),
    calories: entry.totalCalories
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-purple-500" />
        Progresso Semanal (Calorias)
      </h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calories" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">Ainda não há dados suficientes para mostrar progresso.</p>
      )}
    </div>
  );
};

export default WeeklyDashboard;
