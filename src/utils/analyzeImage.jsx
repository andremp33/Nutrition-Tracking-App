export const analyzeImage = async (imageData) => {
  try {
    const response = await fetch('http://localhost:3001/api/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageData })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.foodItems || [];
    
  } catch (error) {
    console.error("Analysis error:", error);
    return [];
  }
};