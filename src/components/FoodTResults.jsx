import { CheckCircle, XCircle, PlusCircle } from 'lucide-react';

export default function FoodResults({ items, onAddFood }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="glass p-6 rounded-2xl mt-6">
      <h3 className="text-lg font-semibold mb-4">Alimentos reconhecidos</h3>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start justify-between p-3 bg-white bg-opacity-50 rounded-lg">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <div className="flex gap-4 mt-1 text-sm">
                <span>{item.nutrition.calories} kcal</span>
                <span>{item.nutrition.carbs}g carb</span>
                <span>{item.nutrition.protein}g prot</span>
                <span>{item.nutrition.fat}g gord</span>
              </div>
              <div className="mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.confidence > 80 ? 'bg-green-100 text-green-800' : 
                  item.confidence > 60 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {item.confidence > 80 ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle size={14} /> Alta confiança
                    </span>
                  ) : item.confidence > 60 ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle size={14} /> Média confiança
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle size={14} /> Baixa confiança
                    </span>
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={() => onAddFood(item)}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
            >
              <PlusCircle size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}