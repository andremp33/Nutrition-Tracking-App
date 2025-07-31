const AnalyzedFoods = ({ capturedImage, analyzedFoods, customQuantity, selectedAnalyzedFood, setSelectedAnalyzedFood, setCustomQuantity, addAnalyzedFood, resetAnalysis }) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Foto Capturada</h3>
          <img 
            src={capturedImage} 
            alt="Foto capturada" 
            className="w-full h-auto rounded-lg border border-gray-200"
          />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Alimentos Detectados</h3>
          
          {analyzedFoods.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum alimento reconhecido. Tente ajustar a foto.
            </p>
          ) : (
            <div className="space-y-3">
              {analyzedFoods.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium capitalize">{item.name}</h4>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>{item.nutrition.calories} kcal</span>
                        <span>{item.nutrition.protein}g prot</span>
                        <span>{item.nutrition.carbs}g carb</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.confidence > 80 ? 'bg-green-100 text-green-800' : 
                      item.confidence > 60 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.confidence}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Quantidade (g)"
                      value={selectedAnalyzedFood === index ? customQuantity : ''}
                      onChange={(e) => {
                        setSelectedAnalyzedFood(index);
                        setCustomQuantity(e.target.value);
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={() => addAnalyzedFood({
                        ...item,
                        quantity: selectedAnalyzedFood === index && customQuantity ? 
                          `${customQuantity}g` : '100g'
                      })}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={resetAnalysis}
            className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
          >
            Tirar Nova Foto
          </button>
        </div>
      </div>
    </div>
  );
};