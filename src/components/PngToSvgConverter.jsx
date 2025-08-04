import React, { useState, useRef } from 'react';
import { SketchPicker } from 'react-color';
import { Upload, Download } from 'lucide-react';
import { useImageConverter } from '../hooks/useImageConverter.js';
import Button from '../components/ui/button.jsx';
import Card from '../components/ui/card.jsx';
import Slider from '../components/ui/slider.jsx';
import fileBack from '../assets/file_back.png';

const PngToSvgConverter = () => {
  const [colors, setColors] = useState(1);
  const [simplify, setSimplify] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [conversionResult, setConversionResult] = useState(null);
  const [palette, setPalette] = useState(['#bdbdbd']);
  const [editingColor, setEditingColor] = useState(null);

  const fileInputRef = useRef(null);
  const { convertPngToSvg, loading, error } = useImageConverter();

  // --- Dosya Seçim Fonksiyonları ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    // Varsayılan renk paleti oluştur
    const defaultColors = 1;
    setColors(defaultColors);
    setPalette(Array(defaultColors).fill('#bdbdbd'));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // --- Dönüştürme ---
  const handleConvert = async () => {
    if (!selectedFile) {
      alert('Lütfen önce bir dosya seçin.');
      return;
    }
    try {
      const result = await convertPngToSvg(selectedFile, colors, simplify);
      setConversionResult(result);
    } catch (err) {
      alert('Dönüştürme sırasında hata: ' + err.message);
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

  // --- Palette Kontrolleri ---
  const updatePaletteSize = (newSize) => {
    setColors(newSize);
    if (newSize > palette.length) {
      setPalette([...palette, ...Array(newSize - palette.length).fill('#bdbdbd')]);
    } else {
      setPalette(palette.slice(0, newSize));
    }
  };

  const handleColorChange = (color) => {
    const newPalette = [...palette];
    newPalette[editingColor] = color.hex;
    setPalette(newPalette);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Drag & Drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center mb-6 transition-colors ${
          dragActive ? 'border-green-400 bg-green-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        <p className="mb-2">Drag & Drop a File</p>
        <Button onClick={openFileDialog}>Choose a File</Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Önizleme Alanları */}
      <div className="flex justify-center gap-12">
        {/* Sol Alan */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(${fileBack})` }}>
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <div className="flex gap-4 mt-4">
            {/* Colors */}
            <div className="flex items-center gap-2">
              <Button onClick={() => updatePaletteSize(Math.max(1, colors - 1))}>-</Button>
              <span className="text-white bg-black px-3 py-1 rounded">{colors}</span>
              <Button onClick={() => updatePaletteSize(Math.min(10, colors + 1))}>+</Button>
            </div>

            {/* Simplify */}
            <div className="flex items-center gap-2">
              <Button onClick={() => setSimplify(Math.max(0, simplify - 1))}>-</Button>
              <span className="text-white bg-black px-3 py-1 rounded">{simplify}</span>
              <Button onClick={() => setSimplify(Math.min(10, simplify + 1))}>+</Button>
            </div>
          </div>

          {/* Palette */}
          <div className="mt-4">
            <p className="text-center text-sm mb-2">Palette</p>
            <div className="flex gap-2">
              {palette.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 border rounded cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => setEditingColor(i)}
                />
              ))}
            </div>
          </div>

          {/* Convert */}
          <Button onClick={handleConvert} className="mt-4 bg-lime-400 px-6 py-2 rounded">
            Convert
          </Button>
        </div>

        {/* Sağ Alan */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url(${fileBack})` }}>
            {conversionResult?.preview && (
              <img
                src={conversionResult.preview}
                alt="SVG Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <p className="mt-2 text-sm">Colors</p>
          <Button
            onClick={downloadSvg}
            disabled={!conversionResult}
            className="mt-4 bg-lime-400 px-6 py-2 rounded"
          >
            <Download className="mr-2 h-4 w-4" /> Download SVG
          </Button>
        </div>
      </div>

      {/* Color Picker */}
      {editingColor !== null && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-4 rounded shadow">
            <SketchPicker color={palette[editingColor]} onChange={handleColorChange} />
            <Button onClick={() => setEditingColor(null)} className="mt-2">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PngToSvgConverter;
