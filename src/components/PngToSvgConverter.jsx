import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Upload, Download, Loader2 } from 'lucide-react';
import { useImageConverter } from '../hooks/useImageConverter.js';

const PngToSvgConverter = () => {
  const [colors, setColors] = useState([9]);
  const [simplify, setSimplify] = useState([0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const fileInputRef = useRef(null);

  const { convertPngToSvg, loading, error } = useImageConverter();

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
    <div className="w-full max-w-5xl mx-auto">
      <Card className="p-6">
        <CardContent>
          <div className="grid grid-cols-3 gap-6 text-center">

            {/* LEFT: Upload */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Drag & Drop a File</p>
              <Button onClick={openFileDialog} className="bg-lime-500 hover:bg-lime-600 mt-2">
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

            {/* CENTER: Controls + Original Preview */}
            <div className="flex flex-col items-center space-y-2">
              {/* Controls */}
              <div className="flex justify-center space-x-8 mb-2">
                <div>
                  <label className="block text-sm mb-1">Colors</label>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" onClick={() => setColors([Math.max(1, colors[0] - 1)])}>-</Button>
                    <span className="px-2 w-6 text-center">{colors[0]}</span>
                    <Button size="sm" onClick={() => setColors([Math.min(32, colors[0] + 1)])}>+</Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Simplify</label>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" onClick={() => setSimplify([Math.max(0, simplify[0] - 1)])}>-</Button>
                    <span className="px-2 w-6 text-center">{simplify[0]}</span>
                    <Button size="sm" onClick={() => setSimplify([Math.min(10, simplify[0] + 1)])}>+</Button>
                  </div>
                </div>
              </div>

              {/* Original Preview */}
              <div className="w-[200px] h-[200px] border-2 border-dashed flex items-center justify-center">
                {filePreview && (
                  <img src={filePreview} alt="Original" className="max-h-[200px]" />
                )}
              </div>

              {/* Palette */}
              <div className="flex space-x-1 mt-2">
                {conversionResult?.colors?.map((color, i) => (
                  <div key={i} className="w-6 h-6 rounded border"
                       style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }} />
                ))}
              </div>
            </div>

            {/* RIGHT: Converted Preview */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-[200px] h-[200px] border-2 border-dashed flex items-center justify-center">
                {conversionResult?.preview && (
                  <img src={conversionResult.preview} alt="SVG Preview" className="max-h-[200px]" />
                )}
              </div>
              {conversionResult && (
                <Button
                  variant="outline"
                  className="bg-lime-500 hover:bg-lime-600 text-white"
                  onClick={downloadSvg}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download SVG
                </Button>
              )}
            </div>
          </div>

          {/* Convert Button */}
          <div className="flex justify-center mt-6">
            <Button
              size="lg"
              className="bg-lime-500 hover:bg-lime-600 text-white px-12"
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

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PngToSvgConverter;
