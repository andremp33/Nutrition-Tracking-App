import React, { useState } from 'react';

const MealItem = ({ meal, onRemove, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [quantity, setQuantity] = useState(meal.quantity);

  const handleSave = () => {
    const parsed = parseFloat(quantity);
    if (!isNaN(parsed)) {
      onUpdate(meal.id, parsed);
      setEditing(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-gray-800">{meal.food}</h4>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{meal.time}</span>
          {meal.confidence && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">IA: {meal.confidence}%</span>
          )}
        </div>

        {editing ? (
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-24 p-1 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={handleSave}
              className="text-green-600 hover:underline text-sm"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-500 hover:underline text-sm"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-2">{meal.quantity}</p>
        )}

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
      <div className="ml-4 space-y-2">
        <button
          onClick={() => setEditing(true)}
          className="text-blue-500 hover:underline text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => onRemove(meal.id)}
          className="text-red-500 hover:underline text-sm"
        >
          Remover
        </button>
      </div>
    </div>
  );
};

export default MealItem;