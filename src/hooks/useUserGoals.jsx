import { useEffect, useState } from 'react';
import { calculateBMR, calculateTDEE, calculateDailyCaloricAdjustment, calculateMacros } from '../utils/calculations';

const useUserGoals = (userProfile) => {
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    summary: ''
  });

  useEffect(() => {
    if (userProfile.weight && userProfile.height && userProfile.age) {
      const bmr = calculateBMR(
        parseFloat(userProfile.weight),
        parseFloat(userProfile.height),
        parseInt(userProfile.age),
        userProfile.gender
      );

      let tdee = calculateTDEE(bmr, userProfile.activityLevel);

      // Ajustar com base em metas e tempo
      let caloricAdjustment = 0;
      if ((userProfile.goal === 'lose' || userProfile.goal === 'gain' || userProfile.goal === 'muscle') && userProfile.targetWeight && userProfile.timeFrameWeeks) {
        caloricAdjustment = calculateDailyCaloricAdjustment(
          parseFloat(userProfile.weight),
          parseFloat(userProfile.targetWeight),
          parseFloat(userProfile.timeFrameWeeks)
        );
      } /*else {
        if (userProfile.goal === 'lose') caloricAdjustment = -500;
        if (userProfile.goal === 'gain') caloricAdjustment = +300;
      }*/

      const adjustedCalories = Math.round(tdee + caloricAdjustment);
      const macros = calculateMacros(adjustedCalories, userProfile.goal === 'muscle' ? 'muscle' : userProfile.goal);

      const summary = (userProfile.targetWeight && userProfile.timeFrameWeeks)
        ? `Para ${userProfile.goal === 'lose' ? 'perder' : 'ganhar'} ${Math.abs(userProfile.targetWeight - userProfile.weight)}kg em ${userProfile.timeFrameWeeks} semana(s), deves consumir ${caloricAdjustment > 0 ? '+' : ''}${Math.round(caloricAdjustment)} kcal/dia.`
        : '';

      setDailyGoals({
        calories: adjustedCalories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        summary
      });
    }
  }, [userProfile]);

  return dailyGoals;
};

export default useUserGoals;
