import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Download, Upload, Loader2 } from "lucide-react";
import fileBack from "../assets/file_back.png";

const SvgToPngConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);
    try {
      // SVG → PNG dönüştürme işlemi burada yapılır.
      const reader = new FileReader();
      reader.onload = (ev) => {
        // Basit önizleme olarak PNG base64 göstereceğiz
        setConversionResult({ preview: ev.target.result });
        setLoading(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      alert("Conversion failed: " + err.message);
      setLoading(false);
    }
  };

  const downloadPng = () => {
    if (!conversionResult?.preview) return;
    const a = document.createElement("a");
    a.href = conversionResult.preview;
    a.download = "converted.png";
    a.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* File Upload */}
      <div
        className="border-2 border-dashed rounded-lg w-full max-w-3xl h-40 flex flex-col items-center justify-center space-y-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="text-gray-400" />
        <span>Drag & Drop a File</span>
        <Button className="bg-green-500 hover:bg-green-600">Choose a File</Button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".svg"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <div className="flex justify-center gap-16 w-full max-w-5xl mt-4">
        {/* LEFT COLUMN */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 border rounded-lg overflow-hidden">
            <img src={fileBack} className="absolute inset-0 w-full h-full" />
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
          </div>

          <Button
            className="mt-3 bg-lime-400 hover:bg-lime-500"
            onClick={handleConvert}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Convert"}
          </Button>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium mb-2">Preview</div>
          <div className="relative w-64 h-64 border rounded-lg overflow-hidden">
            <img src={fileBack} className="absolute inset-0 w-full h-full" />
            {conversionResult?.preview && (
              <img
                src={conversionResult.preview}
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
          </div>

          <Button
            className="mt-3 bg-lime-400 hover:bg-lime-500"
            onClick={downloadPng}
            disabled={!conversionResult}
          >
            <Download className="mr-2 h-4 w-4" /> Download PNG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SvgToPngConverter;
