import React, { useState, useRef } from "react";
import { Upload, Download } from "lucide-react";
import { useImageConverter } from "../hooks/useImageConverter.js";
import fileBack from "../assets/file_back.png";

const SvgToPngConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);

  const fileInputRef = useRef(null);
  const { convertSvgToPng, loading } = useImageConverter();

  const handleFile = (file) => {
    setSelectedFile(file);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const handleConvert = async () => {
    if (!selectedFile) return alert("Please select an SVG file first");
    const result = await convertSvgToPng(selectedFile);
    setConversionResult(result);
  };

  const downloadPng = () => {
    if (!conversionResult?.png) return;
    const link = document.createElement("a");
    link.href = conversionResult.png;
    link.download = "converted.png";
    link.click();
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* File Upload */}
      <div
        className="border-2 border-dashed rounded-lg p-6 w-full max-w-xl text-center cursor-pointer hover:border-green-400"
        onClick={openFileDialog}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="mb-2 text-gray-600">
          Drag & Drop or Click to Select an SVG
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Preview Grid */}
      <div className="flex justify-center gap-12">
        {/* Left Column */}
        <div className="flex flex-col items-center w-72">
          <div
            className="relative w-72 h-72 bg-center bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${fileBack})` }}
          >
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="SVG Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={loading || !selectedFile}
            className="mt-4 bg-lime-400 px-6 py-2 rounded hover:bg-lime-500"
          >
            Convert
          </button>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center w-72">
          <p className="text-sm mb-1">Result</p>
          <div
            className="relative w-72 h-72 bg-center bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${fileBack})` }}
          >
            {conversionResult?.png && (
              <img
                src={conversionResult.png}
                alt="Converted PNG Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <button
            onClick={downloadPng}
            disabled={!conversionResult}
            className="mt-4 bg-lime-400 px-6 py-2 rounded hover:bg-lime-500"
          >
            <Download className="inline mr-1 h-4 w-4" /> Download PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default SvgToPngConverter;
