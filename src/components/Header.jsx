import React from 'react';
import { Utensils, User } from 'lucide-react';

const Header = ({ userProfile, setShowSetup, currentDate, setCurrentDate }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full shadow-lg">
          <Utensils className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold text-gray-800">Perfil Nutricional</h2>
          <div className="badge badge-primary">
            {userProfile.goal === 'lose' ? '🔥 Perder' : userProfile.goal === 'gain' ? '💪 Ganhar' : '⚖️ Manter'} peso
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {userProfile.weight}kg
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {userProfile.height}cm
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            {userProfile.age} anos
          </span>
          {userProfile.targetWeight && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Meta: {userProfile.targetWeight}kg
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={() => setShowSetup(true)}
        className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm"
      >
        <User className="w-4 h-4" />
        Editar Perfil
      </button>
      <input
        type="date"
        value={currentDate}
        onChange={(e) => setCurrentDate(e.target.value)}
        className="input-modern py-2 px-4 text-sm w-auto"
      />
    </div>
  </div>
);

export default Header;