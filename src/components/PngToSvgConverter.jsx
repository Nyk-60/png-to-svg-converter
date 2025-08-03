import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Upload, Download, Loader2 } from "lucide-react";
import { useImageConverter } from "../hooks/useImageConverter.js";
import fileBack from "../assets/file_back.png";

const PngToSvgConverter = () => {
  const [colors, setColors] = useState(1);
  const [simplify, setSimplify] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [conversionResult, setConversionResult] = useState(null);
  const [palette, setPalette] = useState([]);

  const fileInputRef = useRef(null);
  const { convertPngToSvg, loading, error } = useImageConverter();

  // Dosya sürükle-bırak
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
      handleFileSelect({ target: { files: e.dataTransfer.files } });
    }
  };

  // Dosya seçildiğinde
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));

    // Örnek renk algılama (burada backend veya canvas analizini bağlayabilirsin)
    const detectedColors = 5; // Örn. 5 renk algılandı
    setColors(detectedColors);
    setPalette(generatePalette(detectedColors));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Rastgele/placeholder palet üretimi
  const generatePalette = (count) => {
    return Array.from({ length: count }, (_, i) =>
      `hsl(${Math.round((i * 360) / count)},70%,50%)`
    );
  };

  // Colors değiştiğinde palette güncelle
  const updateColors = (newCount) => {
    const limited = Math.max(1, Math.min(10, newCount)); // max 10
    setColors(limited);

    // Paletteyi yeni sayıya göre güncelle
    if (limited > palette.length) {
      setPalette([
        ...palette,
        ...generatePalette(limited - palette.length),
      ]);
    } else {
      setPalette(palette.slice(0, limited));
    }
  };

  // SVG dönüştürme
  const handleConvert = async () => {
    if (!selectedFile) {
      alert("Lütfen önce bir dosya seçin.");
      return;
    }

    try {
      const result = await convertPngToSvg(selectedFile, colors, simplify);
      setConversionResult(result);
    } catch (err) {
      console.error("Conversion error:", err);
      alert("Dönüştürme sırasında bir hata oluştu: " + err.message);
    }
  };

  // SVG indirme
  const downloadSvg = () => {
    if (!conversionResult?.svg) return;

    const blob = new Blob([conversionResult.svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <div
        className={`border-2 rounded-lg p-6 text-center transition-colors mb-8 ${
          dragActive
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm mb-2">Drag & Drop a File</p>
        <Button
          onClick={openFileDialog}
          variant="default"
          className="bg-green-500 hover:bg-green-600"
        >
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

      {/* Ana Grid */}
      <div className="grid grid-cols-2 gap-8 justify-items-center">
        {/* Sol Önizleme */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex justify-center space-x-6 mb-2">
            {/* Colors */}
            <div className="flex flex-col items-center">
              <span className="mb-1 font-medium">Colors</span>
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  className="bg-black text-white"
                  onClick={() => updateColors(colors - 1)}
                >
                  -
                </Button>
                <span className="w-8 text-center">{colors}</span>
                <Button
                  size="sm"
                  className="bg-black text-white"
                  onClick={() => updateColors(colors + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Simplify */}
            <div className="flex flex-col items-center">
              <span className="mb-1 font-medium">Simplify</span>
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  className="bg-black text-white"
                  onClick={() => setSimplify(Math.max(0, simplify - 1))}
                >
                  -
                </Button>
                <span className="w-8 text-center">{simplify}</span>
                <Button
                  size="sm"
                  className="bg-black text-white"
                  onClick={() => setSimplify(Math.min(10, simplify + 1))}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div
            className="relative w-[300px] h-[300px] flex items-center justify-center bg-no-repeat bg-center bg-contain border border-gray-300"
            style={{ backgroundImage: `url(${fileBack})` }}
          >
            {filePreview && (
              <img
                src={filePreview}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          <div className="mt-2 w-[300px]">
            <span className="text-sm font-medium block mb-1">Palette</span>
            <div className="flex justify-between">
              {palette.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Button
            className="mt-4 w-[300px] bg-green-500 hover:bg-green-600"
            onClick={handleConvert}
            disabled={loading || !selectedFile}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert"
            )}
          </Button>
        </div>

        {/* Sağ SVG Önizleme */}
        <div className="flex flex-col items-center space-y-2">
          <div
            className="relative w-[300px] h-[300px] flex items-center justify-center bg-no-repeat bg-center bg-contain border border-gray-300"
            style={{ backgroundImage: `url(${fileBack})` }}
          >
            {conversionResult?.preview && (
              <img
                src={conversionResult.preview}
                alt="Converted SVG"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
          <Button
            className="mt-4 w-[300px] bg-green-500 hover:bg-green-600"
            onClick={downloadSvg}
            disabled={!conversionResult}
          >
            <Download className="mr-2 h-4 w-4" />
            Download SVG
          </Button>
        </div>
      </div>

      {/* Hata Gösterimi */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </Card>
  );
};

export default PngToSvgConverter;
