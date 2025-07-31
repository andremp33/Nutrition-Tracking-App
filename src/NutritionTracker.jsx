import React, { useState, useEffect, useRef } from 'react';
import { Camera, Plus, ArrowLeft, ArrowRight, User, Target, BarChart3, Search, X, Edit2, Trash2, Calendar, Home, Utensils, TrendingUp, Check } from 'lucide-react';

// Funções de cálculo (mock para demonstração)
const calculateBMR = (weight, height, age, gender) => {
  const base = gender === 'male' 
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  return Math.max(base, 1200);
};

const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  return bmr * (multipliers[activityLevel] || 1.55);
};

const calculateMacros = (calories, goal) => {
  if (goal === 'gain' || goal === 'muscle') {
    return {
      protein: Math.round(calories * 0.3 / 4),
      carbs: Math.round(calories * 0.4 / 4),
      fat: Math.round(calories * 0.3 / 9)
    };
  } else if (goal === 'lose') {
    return {
      protein: Math.round(calories * 0.35 / 4),
      carbs: Math.round(calories * 0.35 / 4),
      fat: Math.round(calories * 0.3 / 9)
    };
  }
  return {
    protein: Math.round(calories * 0.25 / 4),
    carbs: Math.round(calories * 0.5 / 4),
    fat: Math.round(calories * 0.25 / 9)
  };
};

// Mock da base de dados de alimentos
const FOOD_DATABASE = {
  apple: { name: 'Maçã', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, per100g: true },
  banana: { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, per100g: true },
  chicken: { name: 'Peito de Frango', calories: 165, protein: 31, carbs: 0, fat: 3.6, per100g: true },
  rice: { name: 'Arroz', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, per100g: true }
};

// Mock da análise de imagem
const analyzeImage = () => [
  { food: 'apple', confidence: 85, estimatedQuantity: 150 },
  { food: 'banana', confidence: 92, estimatedQuantity: 120 }
];

// Componente de navegação inferior móvel
const MobileNavigation = ({ activeTab, setActiveTab }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 safe-area-bottom">
    <div className="flex justify-around items-center">
      {[
        { id: 'home', icon: Home, label: 'Início' },
        { id: 'camera', icon: Camera, label: 'Câmera' },
        { id: 'search', icon: Search, label: 'Pesquisar' },
        { id: 'stats', icon: BarChart3, label: 'Stats' }
      ].map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeTab === id 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Icon className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  </div>
);

// Header móvel otimizado
const MobileHeader = ({ userProfile, setShowSetup, currentDate, changeDate }) => (
  <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-40 safe-area-top">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">NutriTracker</h1>
          <p className="text-xs text-gray-600">{userProfile.weight}kg • {userProfile.height}cm</p>
        </div>
      </div>
      <button 
        onClick={() => setShowSetup(true)}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <User className="w-5 h-5" />
      </button>
    </div>
    
    <div className="flex items-center justify-between">
      <button 
        onClick={() => changeDate('prev')} 
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="text-center flex-1">
        <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
          {new Date(currentDate).toLocaleDateString('pt-PT', { 
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })}
        </span>
      </div>
      <button 
        onClick={() => changeDate('next')} 
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  </div>
);

// Setup Form otimizado para mobile
const MobileSetupForm = ({ userProfile, setUserProfile, setShowSetup }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-4 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">🎯</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Configurar Perfil</h2>
        <p className="text-sm text-gray-600">Configure os seus dados para objetivos personalizados</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Peso (kg)</label>
            <input
              type="number"
              placeholder="70"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={userProfile.weight}
              onChange={(e) => setUserProfile({ ...userProfile, weight: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Altura (cm)</label>
            <input
              type="number"
              placeholder="175"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={userProfile.height}
              onChange={(e) => setUserProfile({ ...userProfile, height: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Idade</label>
            <input
              type="number"
              placeholder="25"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={userProfile.age}
              onChange={(e) => setUserProfile({ ...userProfile, age: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Sexo</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={userProfile.gender}
              onChange={(e) => setUserProfile({ ...userProfile, gender: e.target.value })}
            >
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Atividade</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={userProfile.activityLevel}
            onChange={(e) => setUserProfile({ ...userProfile, activityLevel: e.target.value })}
          >
            <option value="sedentary">Sedentário</option>
            <option value="light">Ligeiro</option>
            <option value="moderate">Moderado</option>
            <option value="active">Ativo</option>
            <option value="very_active">Muito Ativo</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Objetivo</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={userProfile.goal}
            onChange={(e) => setUserProfile({ ...userProfile, goal: e.target.value })}
          >
            <option value="lose">Perder Peso</option>
            <option value="maintain">Manter Peso</option>
            <option value="gain">Ganhar Peso</option>
          </select>
        </div>

        {userProfile.goal !== 'maintain' && (
          <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Meta (kg)</label>
                <input
                  type="number"
                  placeholder="65"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={userProfile.targetWeight}
                  onChange={(e) => setUserProfile({ ...userProfile, targetWeight: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Semanas</label>
                <input
                  type="number"
                  placeholder="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={userProfile.timeFrameWeeks}
                  onChange={(e) => setUserProfile({ ...userProfile, timeFrameWeeks: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            const isValid = userProfile.weight && userProfile.height && userProfile.age &&
              (userProfile.goal === 'maintain' || 
               (userProfile.targetWeight && userProfile.timeFrameWeeks));
            
            if (isValid) {
              setShowSetup(false);
            }
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
          disabled={!userProfile.weight || !userProfile.height || !userProfile.age ||
                   (userProfile.goal !== 'maintain' && (!userProfile.targetWeight || !userProfile.timeFrameWeeks))}
        >
          Começar Jornada
        </button>
      </div>
    </div>
  </div>
);

// Resumo diário otimizado para mobile
const MobileDailySummary = ({ totals, dailyGoals, goal, addMealFromSuggestion }) => {
  const getProgressPercentage = (current, goal) => Math.min((current / goal) * 100, 100);
  const getProgressColor = (percentage) => {
    if (percentage < 80) return 'bg-red-500';
    if (percentage < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const MacroCard = ({ title, current, target, unit, emoji, color }) => {
    const percentage = getProgressPercentage(current, target);
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
            <span>{emoji}</span>
            {title}
          </span>
          <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-gray-800">{current}</span>
          <span className="text-xs text-gray-500">/ {target}{unit}</span>
        </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Progresso Diário
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <MacroCard 
          title="Calorias" 
          current={totals.calories} 
          target={dailyGoals.calories} 
          unit="" 
          emoji="🔥"
        />
        <MacroCard 
          title="Proteína" 
          current={totals.protein} 
          target={dailyGoals.protein} 
          unit="g" 
          emoji="🥩"
        />
        <MacroCard 
          title="Carboidratos" 
          current={totals.carbs} 
          target={dailyGoals.carbs} 
          unit="g" 
          emoji="🍞"
        />
        <MacroCard 
          title="Gordura" 
          current={totals.fat} 
          target={dailyGoals.fat} 
          unit="g" 
          emoji="🥑"
        />
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Adicionar Rápido</h3>
        <div className="flex flex-wrap gap-2">
          {['apple', 'banana', 'chicken', 'rice'].map(food => (
            <button
              key={food}
              onClick={() => addMealFromSuggestion(food, FOOD_DATABASE[food].name, FOOD_DATABASE[food])}
              className="text-xs bg-white text-gray-700 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
            >
              + {FOOD_DATABASE[food].name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Captura de câmera otimizada para mobile
const MobileCameraCapture = ({ startCamera, capturePhoto, showCamera, videoRef, canvasRef, fileInputRef, handleFileUpload }) => (
  <div className="p-4">
    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
      <Camera className="w-5 h-5 text-blue-600" />
      Analisar Alimentos
    </h3>
    
    {showCamera ? (
      <div className="space-y-4">
        <div className="relative rounded-xl overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-cover" />
          <div className="absolute inset-0 border-2 border-white border-dashed rounded-xl pointer-events-none" />
        </div>
        <div className="flex gap-3">
          <button 
            onClick={capturePhoto} 
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Capturar
          </button>
          <button 
            onClick={() => {
              const stream = videoRef.current?.srcObject;
              stream?.getTracks().forEach(t => t.stop());
              setShowCamera(false);
            }} 
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={startCamera} 
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Câmera
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="bg-white text-gray-700 font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Galeria
        </button>
      </div>
    )}
    
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      capture="environment"
      onChange={handleFileUpload}
      className="hidden"
    />
    <canvas ref={canvasRef} className="hidden" />
  </div>
);

// Pesquisa de alimentos usando OpenFoodFacts
const MobileFoodSearch = ({ onAddFood, currentDate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFood = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&json=1&fields=product_name,brands,nutriments,image_url`);
      const data = await res.json();
      setResults((data.products || []).slice(0, 10));
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
      date: currentDate,
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setResults([]);
    setQuery('');
    onAddFood(food);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <Search className="w-5 h-5 text-blue-600" />
        Pesquisar Alimentos
      </h3>
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchFood()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: banana, frango, arroz..."
          />
        </div>
        <button
          onClick={searchFood}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-sm">{item.product_name}</h4>
                {item.brands && (
                  <p className="text-xs text-gray-500">{item.brands}</p>
                )}
                <div className="flex gap-4 text-xs text-gray-600 mt-1">
                  <span>{Math.round(item.nutriments?.['energy-kcal_100g'] || 0)} kcal</span>
                  <span>{Math.round((item.nutriments?.['proteins_100g'] || 0) * 10) / 10}g prot</span>
                </div>
              </div>
              <button
                onClick={() => handleAdd(item)}
                className="bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Lista de refeições otimizada para mobile
const MobileMealsList = ({ meals, removeMeal, currentDate }) => {
  const todaysMeals = meals.filter(meal => meal.date === currentDate);

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Utensils className="w-5 h-5 text-blue-600" />
        Refeições ({todaysMeals.length})
      </h3>
      
      {todaysMeals.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Ainda não adicionou nenhum alimento hoje</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todaysMeals.map((meal) => (
            <div key={meal.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{meal.food}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{meal.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{meal.quantity}</p>
                </div>
                <button
                  onClick={() => removeMeal(meal.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-sm font-bold text-red-600 block">{meal.calories}</span>
                  <span className="text-xs text-gray-500">cal</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-blue-600 block">{meal.protein}g</span>
                  <span className="text-xs text-gray-500">prot</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-green-600 block">{meal.carbs}g</span>
                  <span className="text-xs text-gray-500">carb</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-yellow-600 block">{meal.fat}g</span>
                  <span className="text-xs text-gray-500">gord</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente principal otimizado para mobile
const NutritionTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('home');
  const [showSetup, setShowSetup] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('userProfile') || '{}');
    return !stored.weight || !stored.height || !stored.age;
  });
  
  const [userProfile, setUserProfile] = useState(() => {
    const stored = localStorage.getItem('userProfile');
    return stored ? JSON.parse(stored) : {
      weight: '', height: '', age: '', gender: 'male', activityLevel: 'moderate', goal: 'maintain',
      targetWeight: '', timeFrameWeeks: 8
    };
  });
  
  const [dailyGoals, setDailyGoals] = useState({ calories: 2000, protein: 150, carbs: 250, fat: 67 });
  const [meals, setMeals] = useState(() => {
    const stored = localStorage.getItem('meals');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analyzedFoods, setAnalyzedFoods] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals));
  }, [meals]);

  // Calcular objetivos diários
  useEffect(() => {
    if (userProfile.weight && userProfile.height && userProfile.age && !showSetup) {
      const bmr = calculateBMR(+userProfile.weight, +userProfile.height, +userProfile.age, userProfile.gender);
      let tdee = calculateTDEE(bmr, userProfile.activityLevel);

      const weightDiff = userProfile.goal !== 'maintain' && userProfile.targetWeight
        ? +userProfile.weight - +userProfile.targetWeight
        : 0;

      let adjustment = 0;
      if (userProfile.goal !== 'maintain' && userProfile.timeFrameWeeks > 0) {
        const kcalPerKg = 7700;
        const totalKcal = Math.abs(weightDiff) * kcalPerKg;
        adjustment = totalKcal / (userProfile.timeFrameWeeks * 7);
        if (userProfile.goal === 'lose') tdee -= adjustment;
        if (userProfile.goal === 'gain') tdee += adjustment;
      }

      const macros = calculateMacros(tdee, userProfile.goal);
      setDailyGoals({ calories: Math.round(tdee), ...macros });
    }
  }, [userProfile, showSetup]);

  const changeDate = (direction) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
        setActiveTab('camera');
      }
    } catch {
      fileInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(t => t.stop());
      setShowCamera(false);
      analyzePhoto(imageData);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
        analyzePhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePhoto = async (imageData) => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setAnalyzedFoods(analyzeImage(imageData));
    setIsAnalyzing(false);
  };

  const addAnalyzedFood = (item) => {
    const food = FOOD_DATABASE[item.food];
    const quantity = item.estimatedQuantity;
    const multiplier = food.per100g ? quantity / 100 : quantity;
    const newMeal = {
      id: Date.now(),
      date: currentDate,
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      food: food.name,
      quantity: food.per100g ? `${quantity}g` : `${quantity} unidade(s)`,
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10,
      confidence: item.confidence
    };
    setMeals(prev => [...prev, newMeal]);
    setCapturedImage(null);
    setAnalyzedFoods([]);
    setActiveTab('home');
  };

  const addMealFromSuggestion = (key, label, fallback) => {
    const f = FOOD_DATABASE[key] || fallback;
    const newMeal = {
      id: Date.now(),
      date: currentDate,
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      food: label,
      quantity: f.per100g ? '100g' : '1 unidade',
      calories: Math.round(f.calories),
      protein: Math.round(f.protein * 10) / 10,
      carbs: Math.round(f.carbs * 10) / 10,
      fat: Math.round(f.fat * 10) / 10,
    };
    setMeals(prev => [...prev, newMeal]);
  };

  const removeMeal = (id) => setMeals(prev => prev.filter(m => m.id !== id));

  const calculateDailyTotals = () => meals.filter(m => m.date === currentDate).reduce((totals, m) => ({
    calories: totals.calories + m.calories,
    protein: totals.protein + m.protein,
    carbs: totals.carbs + m.carbs,
    fat: totals.fat + m.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const getHistory = () => {
    const days = [...new Set(meals.map(m => m.date))].sort();
    return days.map(date => ({
      date,
      totalCalories: meals.filter(m => m.date === date).reduce((sum, m) => sum + m.calories, 0)
    }));
  };

  // Componente de alimentos analisados para mobile
  const MobileAnalyzedFoods = ({ capturedImage, analyzedFoods, addAnalyzedFood, resetAnalysis }) => (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Alimentos Detectados</h3>
        <button 
          onClick={resetAnalysis} 
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {capturedImage && (
        <div className="rounded-xl overflow-hidden">
          <img src={capturedImage} alt="Captured" className="w-full h-48 object-cover" />
        </div>
      )}
      
      <div className="space-y-3">
        {analyzedFoods.map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">{FOOD_DATABASE[item.food]?.name}</h4>
                <p className="text-xs text-gray-600">Confiança: {item.confidence}%</p>
                <p className="text-xs text-gray-600">~{item.estimatedQuantity}g</p>
              </div>
              <button
                onClick={() => addAnalyzedFood(item)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Stats/Dashboard para mobile
  const MobileStats = ({ history, totals, dailyGoals }) => {
    const getProgressPercentage = (current, goal) => Math.min((current / goal) * 100, 100);
    
    return (
      <div className="p-4 space-y-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Estatísticas
        </h3>
        
        {/* Progresso Semanal */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Últimos 7 Dias
          </h4>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 6 + i);
              const dayData = history.find(h => h.date === date.toISOString().split('T')[0]);
              const calories = dayData?.totalCalories || 0;
              const height = Math.min((calories / 2500) * 100, 100);
              
              return (
                <div key={i} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">
                    {date.getDate()}
                  </div>
                  <div className="h-16 bg-gray-100 rounded-lg flex items-end justify-center p-1">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{calories}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribuição de Macros */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Distribuição de Macros</h4>
          <div className="space-y-3">
            {[
              { name: 'Proteína', current: totals.protein, target: dailyGoals.protein, color: 'bg-red-500', emoji: '🥩' },
              { name: 'Carboidratos', current: totals.carbs, target: dailyGoals.carbs, color: 'bg-blue-500', emoji: '🍞' },
              { name: 'Gordura', current: totals.fat, target: dailyGoals.fat, color: 'bg-yellow-500', emoji: '🥑' }
            ].map(({ name, current, target, color, emoji }) => {
              const percentage = getProgressPercentage(current, target);
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <span>{emoji}</span>
                      {name}
                    </span>
                    <span className="text-sm font-bold">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{current}g</span>
                    <span>{target}g</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (showSetup) {
    return <MobileSetupForm userProfile={userProfile} setUserProfile={setUserProfile} setShowSetup={setShowSetup} />;
  }

  const dailyTotals = calculateDailyTotals();

  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Analisando com IA...</p>
            <p className="text-gray-500 text-sm">Identificando alimentos na imagem</p>
          </div>
        </div>
      );
    }

    if (capturedImage && analyzedFoods.length > 0) {
      return (
        <MobileAnalyzedFoods 
          capturedImage={capturedImage}
          analyzedFoods={analyzedFoods}
          addAnalyzedFood={addAnalyzedFood}
          resetAnalysis={() => {
            setCapturedImage(null);
            setAnalyzedFoods([]);
            setActiveTab('home');
          }}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div>
            <MobileDailySummary 
              totals={dailyTotals} 
              dailyGoals={dailyGoals} 
              goal={userProfile.goal}
              addMealFromSuggestion={addMealFromSuggestion}
            />
            <MobileMealsList 
              meals={meals} 
              removeMeal={removeMeal} 
              currentDate={currentDate}
            />
          </div>
        );
      case 'camera':
        return (
          <MobileCameraCapture 
            startCamera={startCamera}
            capturePhoto={capturePhoto}
            showCamera={showCamera}
            videoRef={videoRef}
            canvasRef={canvasRef}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
          />
        );
      case 'search':
        return (
          <MobileFoodSearch 
            onAddFood={(food) => setMeals([...meals, food])}
            currentDate={currentDate}
          />
        );
      case 'stats':
        return (
          <MobileStats 
            history={getHistory()}
            totals={dailyTotals}
            dailyGoals={dailyGoals}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        userProfile={userProfile}
        setShowSetup={setShowSetup}
        currentDate={currentDate}
        changeDate={changeDate}
      />
      
      <div className="pb-20">
        {renderContent()}
      </div>
      
      <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default NutritionTracker;