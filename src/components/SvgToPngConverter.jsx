import React, { useState, useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import fileBack from '../assets/file_back.png';
import { useImageConverter } from '../hooks/useImageConverter.js';

const SvgToPngConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const fileInputRef = useRef(null);

  const { convertSvgToPng, loading } = useImageConverter();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    const result = await convertSvgToPng(selectedFile);
    setConversionResult(result);
  };

  const downloadPng = () => {
    if (!conversionResult?.png) return;
    const a = document.createElement('a');
    a.href = conversionResult.png;
    a.download = 'converted.png';
    a.click();
  };

  return (
    <div className="p-6 border rounded-xl shadow-md bg-white">
      {/* Dosya yükleme alanı */}
      <div
        className="border-2 border-dashed rounded-md p-6 text-center mb-6"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto mb-2 text-gray-500" />
        <p>Drag & Drop a File</p>
        <button className="mt-2 px-4 py-1 bg-green-500 text-white rounded">Choose a File</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Önizleme alanı */}
      <div className="grid grid-cols-2 gap-8 items-start">
        {/* Sol Alan */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 bg-center bg-contain bg-no-repeat" style={{backgroundImage:`url(${fileBack})`}}>
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="SVG Preview"
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
          </div>

          <button
            onClick={handleConvert}
            className="mt-4 px-6 py-2 bg-lime-400 rounded text-white font-semibold"
            disabled={!selectedFile || loading}
          >
            Convert
          </button>
        </div>

        {/* Sağ Alan */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 bg-center bg-contain bg-no-repeat" style={{backgroundImage:`url(${fileBack})`}}>
            {conversionResult?.preview && (
              <img
                src={conversionResult.preview}
                alt="PNG Result"
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
          </div>
          <button
            disabled={!conversionResult}
            onClick={downloadPng}
            className="mt-4 px-6 py-2 bg-lime-400 rounded text-white font-semibold disabled:opacity-50"
          >
            <Download className="inline-block mr-1 w-4 h-4" /> Download PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default SvgToPngConverter;
