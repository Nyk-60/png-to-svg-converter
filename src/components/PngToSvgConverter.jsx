import React, { useState, useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import fileBack from '../assets/file_back.png';
import { useImageConverter } from '../hooks/useImageConverter.js';

const PngToSvgConverter = () => {
  const [colors, setColors] = useState(1);
  const [simplify, setSimplify] = useState(0);
  const [palette, setPalette] = useState(["#cccccc"]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const fileInputRef = useRef(null);

  const { convertPngToSvg, loading } = useImageConverter();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    // Burada basit renk analizi (dummy); gerçek uygulamada analiz eklenecek
    const detectedColors = Math.min(5, 10); // örnek 5 renk
    setColors(detectedColors);
    setPalette(Array.from({ length: detectedColors }, (_, i) => `hsl(${i*60},70%,50%)`));
  };

  const handleColorsChange = (newCount) => {
    const count = Math.max(1, Math.min(10, newCount));
    setColors(count);
    setPalette(prev => {
      const updated = [...prev];
      while (updated.length < count) {
        updated.push(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')}`);
      }
      return updated.slice(0, count);
    });
  };

  const handleColorPick = async (index) => {
    if (!window.EyeDropper) {
      alert('EyeDropper API tarayıcınızda desteklenmiyor.');
      return;
    }
    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      setPalette(prev => {
        const updated = [...prev];
        updated[index] = result.sRGBHex;
        return updated;
      });
    } catch (err) {
      console.log("Eyedropper iptal edildi");
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    const result = await convertPngToSvg(selectedFile, colors, simplify);
    setConversionResult(result);
  };

  const downloadSvg = () => {
    if (!conversionResult?.svg) return;
    const blob = new Blob([conversionResult.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.svg';
    a.click();
    URL.revokeObjectURL(url);
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
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Önizleme alanı */}
      <div className="grid grid-cols-2 gap-8 items-start">
        {/* Sol Alan */}
        <div className="flex flex-col items-center">
          <div className="flex space-x-6 mb-2">
            {/* Colors */}
            <div className="flex flex-col items-center">
              <span className="mb-1 text-sm">Colors</span>
              <div className="flex items-center bg-black rounded text-white px-2">
                <button onClick={() => handleColorsChange(colors-1)}>-</button>
                <span className="w-8 text-center">{colors}</span>
                <button onClick={() => handleColorsChange(colors+1)}>+</button>
              </div>
            </div>
            {/* Simplify */}
            <div className="flex flex-col items-center">
              <span className="mb-1 text-sm">Simplify</span>
              <div className="flex items-center bg-black rounded text-white px-2">
                <button onClick={() => setSimplify(Math.max(0,simplify-1))}>-</button>
                <span className="w-8 text-center">{simplify}</span>
                <button onClick={() => setSimplify(Math.min(10,simplify+1))}>+</button>
              </div>
            </div>
          </div>

          <div className="relative w-64 h-64 bg-center bg-contain bg-no-repeat" style={{backgroundImage:`url(${fileBack})`}}>
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
          </div>

          {/* Palette */}
          <div className="mt-2 text-sm">Palette</div>
          <div className="flex space-x-2 mt-1">
            {palette.map((c,i)=>(
              <div
                key={i}
                className="w-6 h-6 border rounded cursor-pointer"
                style={{backgroundColor:c}}
                onClick={()=>handleColorPick(i)}
              />
            ))}
          </div>

          <button
            onClick={handleConvert}
            className="mt-4 px-6 py-2 bg-lime-400 rounded text-white font-semibold"
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
                alt="SVG Preview"
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
          </div>
          <button
            disabled={!conversionResult}
            onClick={downloadSvg}
            className="mt-4 px-6 py-2 bg-lime-400 rounded text-white font-semibold disabled:opacity-50"
          >
            <Download className="inline-block mr-1 w-4 h-4" /> Download SVG
          </button>
        </div>
      </div>
    </div>
  );
};

export default PngToSvgConverter;
