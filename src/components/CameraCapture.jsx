import React, { useRef } from 'react';

const CameraCapture = ({ startCamera, capturePhoto, showCamera, videoRef, canvasRef, fileInputRef, handleFileUpload }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">Análise de Alimentos por Foto</h2>
      {!showCamera && (
        <div className="text-center py-8">
          <div className="space-y-4">
            <button
              onClick={startCamera}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Tirar Foto
            </button>
            <p className="text-gray-500 text-sm">ou</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Carregar Foto
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      )}

      {showCamera && (
        <div className="text-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-md mx-auto rounded-lg mb-4"
          />
          <button
            onClick={capturePhoto}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Capturar
          </button>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;

