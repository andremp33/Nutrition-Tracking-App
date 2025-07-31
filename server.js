import express from 'express';
import { createServer } from 'http'; // Importação crucial
import cors from 'cors';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const server = createServer(app); // Criação explícita do servidor HTTP
const PORT = process.env.PORT || 3001;

// Configuração do CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Cache para nutrição
const nutritionCache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

// Configuração do Vision
const visionClient = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || './nutritracker-credentials.json'
});

// Função para buscar dados nutricionais
async function getNutritionData(foodName) {
  const cached = nutritionCache.get(foodName);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&json=1&fields=product_name,nutriments,image_url`
    );
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    if (data.products?.length > 0) {
      const product = data.products.find(p => p.product_name) || data.products[0];
      const nutriments = product.nutriments || {};
      
      const nutritionData = {
        calories: Math.round(nutriments['energy-kcal_100g'] || 0),
        protein: Math.round((nutriments['proteins_100g'] || 0) * 10) / 10,
        carbs: Math.round((nutriments['carbohydrates_100g'] || 0) * 10) / 10,
        fat: Math.round((nutriments['fat_100g'] || 0) * 10) / 10,
        image: product.image_url || null
      };
      
      nutritionCache.set(foodName, {
        data: nutritionData,
        timestamp: Date.now()
      });
      
      return nutritionData;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar no OpenFoodFacts:', error);
    return null;
  }
}

// Rotas
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ 
        success: false,
        error: 'Dados de imagem são obrigatórios' 
      });
    }

    const base64Data = imageData.startsWith('data:image') ? 
      imageData.split(',')[1] : imageData;

    const [result] = await visionClient.labelDetection({
      image: { content: base64Data },
      maxResults: 10
    });

    const foodItems = (await Promise.all(
      result.labelAnnotations
        ?.filter(label => label.score > 0.5)
        .map(async label => {
          const foodName = label.description.toLowerCase();
          const nutrition = await getNutritionData(foodName);
          return nutrition ? {
            name: foodName,
            displayName: foodName.split(' ')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' '),
            confidence: Math.round(label.score * 100),
            nutrition,
            image: nutrition.image
          } : null;
        }) || []
    )).filter(Boolean);

    foodItems.sort((a, b) => b.confidence - a.confidence);

    res.json({ 
      success: true, 
      foodItems,
      analyzedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro na análise:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao processar imagem',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});

// Middleware de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    success: false,
    error: 'Erro interno no servidor'
  });
});

// Inicialização do servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Handlers para encerramento
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Servidor encerrado');
  });
});

process.on('uncaughtException', (err) => {
  console.error('Erro não tratado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Promise rejeitada não tratada:', err);
});