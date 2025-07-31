import React from 'react';

const SetupForm = ({ userProfile, setUserProfile, setShowSetup }) => {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center animate-fadeIn">
      <div className="card max-w-lg w-full animate-scaleIn">
        <div className="text-center mb-8">
          <div className="relative mx-auto mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-full w-20 h-20 mx-auto shadow-xl">
              <span className="text-white text-3xl">🎯</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Configura o teu Perfil</h1>
          <p className="text-gray-600 text-lg">Vamos calcular os teus objetivos nutricionais personalizados</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-blue-500">⚖️</span>
                Peso (kg)
              </label>
              <input
                type="number"
                value={userProfile.weight}
                onChange={(e) => setUserProfile({ ...userProfile, weight: e.target.value })}
                className="input-modern"
                placeholder="70"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-green-500">📏</span>
                Altura (cm)
              </label>
              <input
                type="number"
                value={userProfile.height}
                onChange={(e) => setUserProfile({ ...userProfile, height: e.target.value })}
                className="input-modern"
                placeholder="175"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-purple-500">🎂</span>
                Idade
              </label>
              <input
                type="number"
                value={userProfile.age}
                onChange={(e) => setUserProfile({ ...userProfile, age: e.target.value })}
                className="input-modern"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-pink-500">👤</span>
                Sexo
              </label>
              <select
                value={userProfile.gender}
                onChange={(e) => setUserProfile({ ...userProfile, gender: e.target.value })}
                className="input-modern"
              >
                <option value="male">👨 Masculino</option>
                <option value="female">👩 Feminino</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-orange-500">🏃</span>
              Nível de Atividade
            </label>
            <select
              value={userProfile.activityLevel}
              onChange={(e) => setUserProfile({ ...userProfile, activityLevel: e.target.value })}
              className="input-modern"
            >
              <option value="sedentary">😴 Sedentário</option>
              <option value="light">🚶 Ligeiro</option>
              <option value="moderate">🏃 Moderado</option>
              <option value="active">💪 Ativo</option>
              <option value="very_active">🔥 Muito Ativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-red-500">🎯</span>
              Objetivo
            </label>
            <select
              value={userProfile.goal}
              onChange={(e) => setUserProfile({ ...userProfile, goal: e.target.value })}
              className="input-modern"
            >
              <option value="lose">🔥 Perder Peso</option>
              <option value="maintain">⚖️ Manter Peso</option>
              <option value="gain">💪 Ganhar Massa Muscular</option>
            </select>
          </div>

          {(userProfile.goal === 'lose' || userProfile.goal === 'gain') && (
            <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 animate-slideUp">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                Definir Meta
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-green-500">🏆</span>
                    Peso Objetivo (kg)
                  </label>
                  <input
                    type="number"
                    value={userProfile.targetWeight}
                    onChange={(e) => setUserProfile({ ...userProfile, targetWeight: e.target.value })}
                    className="input-modern"
                    placeholder="65"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-yellow-500">📅</span>
                    Semanas para a meta
                  </label>
                  <input
                    type="number"
                    value={userProfile.timeFrameWeeks || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, timeFrameWeeks: e.target.value })}
                    className="input-modern"
                    placeholder="4"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <button
              onClick={() => {
                // Validar se todos os campos obrigatórios estão preenchidos
                const isValid = userProfile.weight && userProfile.height && userProfile.age &&
                  (userProfile.goal === 'maintain' || 
                   (userProfile.targetWeight && userProfile.timeFrameWeeks));
                
                if (isValid) {
                  setShowSetup(false);
                }
              }}
              className="btn-primary w-full py-4 text-lg font-semibold"
              disabled={!userProfile.weight || !userProfile.height || !userProfile.age ||
                       (userProfile.goal !== 'maintain' && (!userProfile.targetWeight || !userProfile.timeFrameWeeks))}
            >
              <span className="flex items-center justify-center gap-2">
                <span>🚀</span>
                Começar Jornada Nutricional
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;