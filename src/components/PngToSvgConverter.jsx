import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Upload, Download, Loader2 } from 'lucide-react';
import { useImageConverter } from '../hooks/useImageConverter.js';
import fileBack from '../assets/file_back.png';

const PngToSvgConverter = () => {
  const [colors, setColors] = useState([1]);
  const [simplify, setSimplify] = useState([0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const fileInputRef = useRef(null);

  const { convertPngToSvg, loading, error } = useImageConverter();

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // İlk yüklemede algılanan renk sayısını başlat
      setColors([1]);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      alert('Lütfen önce bir dosya seçin.');
      return;
    }
    try {
      const result = await convertPngToSvg(selectedFile, colors[0], simplify[0]);
      setConversionResult(result);
    } catch (err) {
      alert('Dönüştürme sırasında bir hata oluştu: ' + err.message);
    }
  };

  const downloadSvg = () => {
    if (!conversionResult?.svg) return;
    const blob = new Blob([conversionResult.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Dosya yükleme alanı */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center w-full max-w-2xl">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">Drag & Drop a File</p>
        <Button onClick={() => fileInputRef.current.click()} className="bg-green-500 hover:bg-green-600">
          Choose a File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Önizleme ve Sonuç Alanı */}
      <div className="flex justify-center space-x-12 w-full max-w-4xl">
        {/* Sol Taraf */}
        <div className="flex flex-col items-center w-[300px]">
          {/* Colors & Simplify */}
          <div className="flex space-x-6 mb-2">
            <div className="flex flex-col items-center">
              <span className="mb-1 text-sm font-medium">Colors</span>
              <div className="flex items-center space-x-2 bg-black text-white px-2 py-1 rounded">
                <button onClick={() => setColors([Math.max(1, colors[0] - 1)])}>-</button>
                <span className="w-6 text-center">{colors[0]}</span>
                <button onClick={() => setColors([Math.min(10, colors[0] + 1)])}>+</button>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="mb-1 text-sm font-medium">Simplify</span>
              <div className="flex items-center space-x-2 bg-black text-white px-2 py-1 rounded">
                <button onClick={() => setSimplify([Math.max(0, simplify[0] - 1)])}>-</button>
                <span className="w-6 text-center">{simplify[0]}</span>
                <button onClick={() => setSimplify([Math.min(10, simplify[0] + 1)])}>+</button>
              </div>
            </div>
          </div>

          {/* Input Preview */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-2">
            <img src={fileBack} alt="Background" className="absolute inset-0 w-full h-full object-cover rounded" />
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Input Preview"
                className="max-w-full max-h-full object-contain z-10"
              />
            )}
          </div>

          {/* Palette */}
          <span className="mb-1 text-sm font-medium">Palette</span>
          <div className="flex space-x-1 mb-4">
            {Array.from({ length: colors[0] }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                style={{ backgroundColor: '#bbb' }}
              />
            ))}
          </div>

          {/* Convert Button */}
          <Button
            onClick={handleConvert}
            className="bg-lime-400 hover:bg-lime-500 px-6 py-2 rounded text-white font-medium"
            disabled={loading || !selectedFile}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              'Convert'
            )}
          </Button>
        </div>

        {/* Sağ Taraf */}
        <div className="flex flex-col items-center w-[300px]">
          <span className="mb-2 text-sm font-medium">Colors</span>
          <div className="relative w-64 h-64 flex items-center justify-center mb-4">
            <img src={fileBack} alt="Background" className="absolute inset-0 w-full h-full object-cover rounded" />
            {conversionResult?.preview && (
              <img
                src={conversionResult.preview}
                alt="Output Preview"
                className="max-w-full max-h-full object-contain z-10"
              />
            )}
          </div>

          <Button
            onClick={downloadSvg}
            className="bg-lime-400 hover:bg-lime-500 px-6 py-2 rounded text-white font-medium"
            disabled={!conversionResult}
          >
            <Download className="mr-2 h-4 w-4" />
            Download SVG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PngToSvgConverter;
