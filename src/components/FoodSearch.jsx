import React, { useState } from 'react';

const FoodSearch = ({ onAddFood }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFood = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&json=1`);
      const data = await res.json();
      setResults(data.products || []);
    } catch (err) {
      console.error('Erro na API OpenFoodFacts', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (product) => {
    const nutriments = product.nutriments || {};
    const food = {
      id: Date.now(),
      food: product.product_name || 'Alimento Desconhecido',
      quantity: '100g',
      calories: Math.round(nutriments['energy-kcal_100g'] || 0),
      protein: Math.round((nutriments['proteins_100g'] || 0) * 10) / 10,
      carbs: Math.round((nutriments['carbohydrates_100g'] || 0) * 10) / 10,
      fat: Math.round((nutriments['fat_100g'] || 0) * 10) / 10,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };
    
    // Limpar resultados após adicionar
    setResults([]);
    setQuery('');
    
    onAddFood(food);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Pesquisar Alimentos</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchFood()}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Ex: arroz, banana, frango..."
        />
        <button
          onClick={searchFood}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Buscar
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">A buscar resultados...</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {results.map((item, index) => (
            <li key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-xs text-gray-500">Marca: {item.brands}</p>
                </div>
                <button
                  onClick={() => handleAdd(item)}
                  className="text-sm text-green-600 hover:underline"
                >
                  Adicionar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FoodSearch;
