import { useState, useRef } from 'react';
import { Camera, ScanBarcode, Sandwich, Apple, Pizza } from 'lucide-react';

export default function FoodScanner({ onFoodDetected }) {
  const [mode, setMode] = useState('camera'); // 'camera' or 'upload'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setMode('camera');
    } catch (err) {
      setError('Não foi possível acessar a câmera');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/jpeg');
    setPreview(imageData);
    analyzeImage(imageData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      setPreview(imageData);
      analyzeImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      });

      const data = await response.json();
      
      if (data.success && data.foodItems.length > 0) {
        onFoodDetected(data.foodItems);
      } else {
        setError('Nenhum alimento reconhecido. Tente uma foto mais clara.');
      }
    } catch (err) {
      setError('Erro ao analisar a imagem');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ScanBarcode size={24} />
        Escanear Alimento
      </h2>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            stopCamera();
            setMode('upload');
            fileInputRef.current.click();
          }}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${mode === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          <Camera size={18} /> Upload
        </button>
        <button
          onClick={startCamera}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${mode === 'camera' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          <Camera size={18} /> Câmera
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      
      {mode === 'camera' ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto rounded-lg bg-black"
          />
          <button
            onClick={captureImage}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-full shadow-lg"
          >
            <Camera size={24} className="text-blue-500" />
          </button>
        </div>
      ) : preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-auto rounded-lg" 
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg"
          >
            <Camera size={18} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Camera size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">Nenhuma imagem selecionada</p>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
      
      {isLoading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Analisando imagem...</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Dicas para melhor reconhecimento:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center gap-2"><Apple size={14} /> Fotografe o alimento isolado</li>
          <li className="flex items-center gap-2"><Sandwich size={14} /> Boa iluminação é essencial</li>
          <li className="flex items-center gap-2"><Pizza size={14} /> Enquadre o alimento no centro</li>
        </ul>
      </div>
    </div>
  );
  
}