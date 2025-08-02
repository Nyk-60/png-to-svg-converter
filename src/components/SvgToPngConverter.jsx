import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Upload, Download, ArrowRight } from 'lucide-react';

const SvgToPngConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <span>SVG</span>
          <ArrowRight className="h-5 w-5" />
          <span>PNG</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
            accept=".svg"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Convert and Download Buttons */}
        <div className="flex justify-center space-x-4">
          <Button size="lg">
            Convert
          </Button>
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SvgToPngConverter;

