import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#eab308'];

const MacrosPieChart = ({ protein, carbs, fat }) => {
  const data = [
    { name: 'Proteína', value: protein },
    { name: 'Carboidratos', value: carbs },
    { name: 'Gordura', value: fat }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Distribuição dos Macros</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}g`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacrosPieChart;
