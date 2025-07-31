import React from 'react';

const MealsList = ({ meals, removeMeal, currentDate }) => {
  const todaysMeals = meals.filter(meal => meal.date === currentDate);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        Refeições do Dia ({todaysMeals.length})
      </h2>
      {todaysMeals.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Ainda não adicionaste nenhum alimento hoje.</p>
      ) : (
        <div className="space-y-3">
          {todaysMeals.map((meal) => (
            <div key={meal.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-800">{meal.food}</h4>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{meal.time}</span>
                  {meal.confidence && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      IA: {meal.confidence}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{meal.quantity}</p>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <span className="font-medium text-red-600">{meal.calories}</span>
                    <p className="text-gray-500">cal</p>
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-blue-600">{meal.protein}g</span>
                    <p className="text-gray-500">prot</p>
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-green-600">{meal.carbs}g</span>
                    <p className="text-gray-500">carb</p>
                  </div>
                  <div className="text-center">
                    <span className="font-medium text-yellow-600">{meal.fat}g</span>
                    <p className="text-gray-500">gord</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeMeal(meal.id)}
                className="ml-4 text-red-500 hover:text-red-700 font-medium text-sm"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealsList;

