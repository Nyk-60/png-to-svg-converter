import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Upload, Download, Loader2 } from 'lucide-react';
import { useImageConverter } from '../hooks/useImageConverter.js';
import fileBack from '../assets/file_back.png';

const PngToSvgConverter = () => {
  const [colors, setColors] = useState([1]);
  const [simplify, setSimplify] = useState([0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const { convertPngToSvg, loading, error } = useImageConverter();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const handleConvert = async () => {
    if (!selectedFile) {
      alert('Lütfen önce bir dosya seçin.');
      return;
    }
    try {
      const result = await convertPngToSvg(selectedFile, colors[0], simplify[0]);
      setConversionResult(result);
    } catch (err) {
      console.error('Conversion error:', err);
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

  const handleColorPick = (index) => {
    const input = document.createElement('input');
    input.type = 'color';
    input.oninput = (e) => {
      const newColors = [...(conversionResult?.colors || Array(colors[0]).fill('#ccc'))];
      newColors[index] = e.target.value;
      setConversionResult({ ...conversionResult, colors: newColors });
    };
    input.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="p-6">
        <CardContent className="space-y-6">

          {/* Drag & Drop */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm mb-2">Drag & Drop a File</p>
            <Button onClick={openFileDialog} className="bg-green-500 hover:bg-green-600">
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

          {/* Preview Area */}
          <div className="grid grid-cols-2 gap-8 items-start">
            {/* LEFT */}
            <div className="flex flex-col items-center space-y-3">

              {/* Controls */}
              <div className="flex space-x-8">
                {/* Colors */}
                <div className="flex flex-col items-center space-y-1">
                  <label className="text-sm font-medium">Colors</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black text-white"
                      onClick={() => setColors([Math.max(1, colors[0] - 1)])}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center">{colors[0]}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black text-white"
                      onClick={() => setColors([Math.min(10, colors[0] + 1)])}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Simplify */}
                <div className="flex flex-col items-center space-y-1">
                  <label className="text-sm font-medium">Simplify</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black text-white"
                      onClick={() => setSimplify([Math.max(0, simplify[0] - 1)])}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center">{simplify[0]}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black text-white"
                      onClick={() => setSimplify([Math.min(10, simplify[0] + 1)])}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              <div
                className="w-64 h-64 bg-center bg-contain bg-no-repeat border-2 border-dashed rounded-md flex items-center justify-center"
                style={{ backgroundImage: `url(${fileBack})` }}
              >
                {selectedFile && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>

              {/* Palette */}
              <div className="flex flex-col items-center space-y-2 w-64">
                <span className="text-sm font-medium">Palette</span>
                <div className="flex justify-between w-full">
                  {Array.from({ length: colors[0] }, (_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: conversionResult?.colors?.[i] || '#ccc' }}
                      onClick={() => handleColorPick(i)}
                    />
                  ))}
                </div>
              </div>

              {/* Convert Button */}
              <Button
                onClick={handleConvert}
                disabled={loading || !selectedFile}
                className="bg-lime-400 hover:bg-lime-500 mt-2 w-40"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Convert'}
              </Button>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-center space-y-3">
              <div
                className="w-64 h-64 bg-center bg-contain bg-no-repeat border-2 border-dashed rounded-md flex items-center justify-center"
                style={{ backgroundImage: `url(${fileBack})` }}
              >
                {conversionResult?.preview && (
                  <img
                    src={conversionResult.preview}
                    alt="SVG Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>

              <Button
                onClick={downloadSvg}
                disabled={!conversionResult}
                className="bg-lime-400 hover:bg-lime-500 mt-2 w-40"
              >
                <Download className="mr-2 h-4 w-4" />
                Download SVG
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PngToSvgConverter;
