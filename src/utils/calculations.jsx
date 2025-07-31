export const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

export const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  return bmr * (multipliers[activityLevel] || 1.55);
};

export const calculateDailyCaloricAdjustment = (currentWeight, targetWeight, weeks) => {
  const weightDifference = targetWeight - currentWeight;
  const totalCalories = weightDifference * 7700; // 7700 kcal por kg
  const dailyAdjustment = totalCalories / (weeks * 7);
  return dailyAdjustment;
};

export const calculateMacros = (calories, goal) => {
  let proteinRatio, carbRatio, fatRatio;

  switch (goal) {
    case 'lose':
      proteinRatio = 0.35; carbRatio = 0.35; fatRatio = 0.30;
      break;
    case 'gain':
      proteinRatio = 0.30; carbRatio = 0.45; fatRatio = 0.25;
      break;
    case 'muscle':
      proteinRatio = 0.35; carbRatio = 0.40; fatRatio = 0.25;
      break;
    default:
      proteinRatio = 0.30; carbRatio = 0.40; fatRatio = 0.30;
  }

  return {
    protein: Math.round((calories * proteinRatio) / 4),
    carbs: Math.round((calories * carbRatio) / 4),
    fat: Math.round((calories * fatRatio) / 9)
  };
};