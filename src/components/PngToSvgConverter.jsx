import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Upload, Download, Loader2 } from 'lucide-react';
import { useImageConverter } from '../hooks/useImageConverter.js';
import fileBack from '../assets/file_back.png';
import { SketchPicker } from 'react-color';

const PngToSvgConverter = () => {
  const [colors, setColors] = useState([1]);
  const [simplify, setSimplify] = useState([0]);
  const [palette, setPalette] = useState(['#bfbfbf']);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const [activeColorIndex, setActiveColorIndex] = useState(null);
  const [loadingConvert, setLoadingConvert] = useState(false);

  const fileInputRef = useRef(null);
  const { convertPngToSvg } = useImageConverter();

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Varsayılan: tek renk ile başlat
      setColors([1]);
      setPalette(['#bfbfbf']);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    try {
      setLoadingConvert(true);
      const result = await convertPngToSvg(selectedFile, colors[0], simplify[0]);
      setConversionResult(result);
    } finally {
      setLoadingConvert(false);
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

  // Renk paletini güncelle
  const handleColorChange = (color, index) => {
    const newPalette = [...palette];
    newPalette[index] = color.hex;
    setPalette(newPalette);
  };

  // Colors + / - kontrolü
  const changeColors = (val) => {
    let newCount = Math.min(10, Math.max(1, colors[0] + val));
    setColors([newCount]);
    const newPalette = [...palette];
    if (newCount > palette.length) {
      for (let i = palette.length; i < newCount; i++) {
        newPalette.push('#bfbfbf'); // placeholder renk
      }
    } else {
      newPalette.length = newCount;
    }
    setPalette(newPalette);
  };

  return (
    <div className="w-full max-w-5xl mx-auto text-center space-y-4">
      {/* Dosya Yükleme */}
      <div
        className="border-2 border-dashed rounded-lg p-6 mb-6"
        onClick={openFileDialog}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="mb-2 text-gray-600">Drag & Drop a File</p>
        <Button className="bg-green-500 hover:bg-green-600">Choose a File</Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Önizleme Alanları */}
      <div className="flex justify-center space-x-12">
        {/* Sol Alan */}
        <div className="flex flex-col items-center w-72">
          <div
            className="relative w-72 h-72 bg-center bg-cover mb-2"
            style={{ backgroundImage: `url(${fileBack})` }}
          >
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Colors & Simplify */}
          <div className="flex space-x-4 mb-2">
            <div className="flex items-center space-x-1">
              <Button onClick={() => changeColors(-1)} className="bg-black text-white h-7 w-7 p-0">-</Button>
              <span className="text-white bg-black w-8 flex justify-center">{colors[0]}</span>
              <Button onClick={() => changeColors(1)} className="bg-black text-white h-7 w-7 p-0">+</Button>
            </div>
            <div className="flex items-center space-x-1">
              <Button onClick={() => setSimplify([Math.max(0, simplify[0]-1)])} className="bg-black text-white h-7 w-7 p-0">-</Button>
              <span className="text-white bg-black w-8 flex justify-center">{simplify[0]}</span>
              <Button onClick={() => setSimplify([Math.min(10, simplify[0]+1)])} className="bg-black text-white h-7 w-7 p-0">+</Button>
            </div>
          </div>

          {/* Palette */}
          <div className="mb-2">
            <span className="text-sm">Palette</span>
            <div className="flex justify-center mt-1 space-x-1">
              {palette.map((color, i) => (
                <div
                  key={i}
                  onClick={() => setActiveColorIndex(i)}
                  className="w-6 h-6 rounded cursor-pointer border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Renk Seçici */}
          {activeColorIndex !== null && (
            <div className="absolute mt-2 z-50">
              <SketchPicker
                color={palette[activeColorIndex]}
                onChange={(color) => handleColorChange(color, activeColorIndex)}
              />
              <Button
                className="mt-2 bg-red-500 text-white"
                onClick={() => setActiveColorIndex(null)}
              >
                Close
              </Button>
            </div>
          )}

          {/* Convert */}
          <Button
            className="bg-lime-400 hover:bg-lime-500 mt-2"
            onClick={handleConvert}
            disabled={loadingConvert || !selectedFile}
          >
            {loadingConvert ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Convert'}
          </Button>
        </div>

        {/* Sağ Alan */}
        <div className="flex flex-col items-center w-72">
          <span className="mb-1 text-sm">Colors</span>
          <div
            className="relative w-72 h-72 bg-center bg-cover mb-2"
            style={{ backgroundImage: `url(${fileBack})` }}
          >
            {conversionResult?.preview && (
              <img
                src={conversionResult.preview}
                alt="SVG Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          {/* SVG Colors */}
          {conversionResult?.colors && (
            <div className="flex justify-center mt-1 space-x-1 mb-2">
              {conversionResult.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded border cursor-pointer"
                  style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
                />
              ))}
            </div>
          )}

          <Button
            className="bg-lime-400 hover:bg-lime-500 mt-2"
            onClick={downloadSvg}
            disabled={!conversionResult}
          >
            <Download className="mr-1 h-4 w-4" /> Download SVG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PngToSvgConverter;
