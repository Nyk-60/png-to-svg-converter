import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Upload, Download, Loader2 } from 'lucide-react';
import fileBack from '../assets/file_back.png';

const SvgToPngConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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

    setLoading(true);
    try {
      // Burada gerçek dönüşüm işlemini yapmanız lazım
      // Simülasyon için 1 sn bekleyelim
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // PNG sonucu olarak sadece aynı dosyayı göstereceğiz (örnek)
      setConversionResult(URL.createObjectURL(selectedFile));
    } catch (err) {
      alert('Dönüştürme sırasında bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPng = () => {
    if (!conversionResult) return;

    const a = document.createElement('a');
    a.href = conversionResult;
    a.download = 'converted.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
              accept=".svg"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Preview Area */}
          <div className="grid grid-cols-2 gap-8 items-start">
            {/* LEFT */}
            <div className="flex flex-col items-center space-y-3">
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
                {conversionResult && (
                  <img
                    src={conversionResult}
                    alt="PNG Result"
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>

              <Button
                onClick={downloadPng}
                disabled={!conversionResult}
                className="bg-lime-400 hover:bg-lime-500 mt-2 w-40"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SvgToPngConverter;
