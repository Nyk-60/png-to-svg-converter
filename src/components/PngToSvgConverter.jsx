import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Upload, Download, Loader2 } from 'lucide-react';
import { useImageConverter } from '../hooks/useImageConverter.js';

const PngToSvgConverter = () => {
  const [colors, setColors] = useState([9]);
  const [simplify, setSimplify] = useState([0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [conversionResult, setConversionResult] = useState(null);
  const fileInputRef = useRef(null);

  const { convertPngToSvg, loading, error } = useImageConverter();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Step indicators */}
      <div className="flex justify-center items-center mb-8 space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
          <span className="text-sm text-gray-600">Select a PNG or JPG from your device</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
          <span className="text-sm text-gray-600">Select the number of palettes for your final SVG file.</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
          <span className="text-sm text-gray-600">Click Convert</span>
        </div>
      </div>

      <Card className="p-6">
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Colors</label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setColors([Math.max(1, colors[0] - 1)])}
                >
                  -
                </Button>
                <Slider
                  value={colors}
                  onValueChange={setColors}
                  max={32}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setColors([Math.min(32, colors[0] + 1)])}
                >
                  +
                </Button>
                <span className="text-sm font-medium w-8">{colors[0]}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Simplify</label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSimplify([Math.max(0, simplify[0] - 1)])}
                >
                  -
                </Button>
                <Slider
                  value={simplify}
                  onValueChange={setSimplify}
                  max={10}
                  min={0}
                  step={1}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSimplify([Math.min(10, simplify[0] + 1)])}
                >
                  +
                </Button>
                <span className="text-sm font-medium w-8">{simplify[0]}</span>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drag & Drop a File
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {selectedFile ? selectedFile.name : 'or'}
            </p>
            <Button onClick={openFileDialog} variant="outline">
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

          {/* Side by Side Preview */}
          {(filePreview || conversionResult?.preview) && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <div className="flex justify-center space-x-6">
                {/* Original File Preview */}
                {filePreview && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">Original</span>
                    <img
                      src={filePreview}
                      alt="Original Preview"
                      className="max-w-[180px] border rounded"
                    />
                  </div>
                )}

                {/* Converted SVG Preview */}
                {conversionResult?.preview && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">Converted SVG</span>
                    <img
                      src={conversionResult.preview}
                      alt="Converted Preview"
                      className="max-w-[180px] border rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Palette Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Palette</label>
            <div className="flex space-x-2">
              {conversionResult?.colors
                ? conversionResult.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
                    />
                  ))
                : Array.from({ length: colors[0] }, (_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: `hsl(${(i * 360) / colors[0]}, 70%, 50%)` }}
                    />
                  ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Convert Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="px-8"
              onClick={handleConvert}
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

          {/* Download Button */}
          {conversionResult && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="px-8"
                onClick={downloadSvg}
              >
                <Download className="mr-2 h-4 w-4" />
                Download SVG
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PngToSvgConverter;
