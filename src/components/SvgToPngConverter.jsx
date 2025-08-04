import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Upload, Download, Loader2 } from 'lucide-react';
import { useImageConverter } from '../hooks/useImageConverter.js';
import fileBack from '../assets/file_back.png';

const SvgToPngConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const fileInputRef = useRef(null);

  const { convertSvgToPng, loading, error } = useImageConverter();

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      alert('Lütfen önce bir dosya seçin.');
      return;
    }
    try {
      const result = await convertSvgToPng(selectedFile);
      setConversionResult(result);
    } catch (err) {
      alert('Dönüştürme sırasında bir hata oluştu: ' + err.message);
    }
  };

  const downloadPng = () => {
    if (!conversionResult?.png) return;
    const link = document.createElement('a');
    link.href = conversionResult.png;
    link.download = 'converted.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          accept=".svg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Önizleme ve Sonuç Alanı */}
      <div className="flex justify-center space-x-12 w-full max-w-4xl">
        {/* Sol Taraf */}
        <div className="flex flex-col items-center w-[300px]">
          <div className="relative w-64 h-64 flex items-center justify-center mb-4">
            <img src={fileBack} alt="Background" className="absolute inset-0 w-full h-full object-cover rounded" />
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Input Preview"
                className="max-w-full max-h-full object-contain z-10"
              />
            )}
          </div>

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
          <span className="mb-2 text-sm font-medium">Preview</span>
          <div className="relative w-64 h-64 flex items-center justify-center mb-4">
            <img src={fileBack} alt="Background" className="absolute inset-0 w-full h-full object-cover rounded" />
            {conversionResult?.png && (
              <img
                src={conversionResult.png}
                alt="Output Preview"
                className="max-w-full max-h-full object-contain z-10"
              />
            )}
          </div>

          <Button
            onClick={downloadPng}
            className="bg-lime-400 hover:bg-lime-500 px-6 py-2 rounded text-white font-medium"
            disabled={!conversionResult}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SvgToPngConverter;
