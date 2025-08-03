import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Upload, Download, Loader2 } from "lucide-react";
import { useImageConverter } from "../hooks/useImageConverter.js";
import fileBack from "../assets/file_back.png";

const PngToSvgConverter = () => {
  const [colors, setColors] = useState([1]);
  const [simplify, setSimplify] = useState([0]);
  const [palette, setPalette] = useState(["#cccccc"]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const fileInputRef = useRef(null);

  const { convertPngToSvg, loading, error } = useImageConverter();

  // EyeDropper ile renk seçimi
  const handlePickColor = async (index) => {
    if (!window.EyeDropper) return alert("EyeDropper API desteklenmiyor!");
    const eyeDropper = new EyeDropper();
    try {
      const result = await eyeDropper.open();
      const newPalette = [...palette];
      newPalette[index] = result.sRGBHex;
      setPalette(newPalette);
    } catch {
      console.log("Renk seçimi iptal edildi.");
    }
  };

  // Dosya seçildiğinde
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      simulateColorDetection(file);
    }
  };

  const simulateColorDetection = (file) => {
    // Gerçek projede burada renk algılama yapılacak
    const detectedColors = ["#ff0000", "#00ff00", "#0000ff"].slice(0, 3);
    setColors([detectedColors.length]);
    setPalette(detectedColors);
  };

  // Colors state değişince palette güncelle
  useEffect(() => {
    const count = Math.min(10, colors[0]);
    setPalette((prev) => {
      let newPalette = [...prev];
      if (newPalette.length < count) {
        for (let i = newPalette.length; i < count; i++) {
          newPalette.push(`hsl(${(i * 360) / count}, 70%, 50%)`);
        }
      } else {
        newPalette = newPalette.slice(0, count);
      }
      return newPalette;
    });
  }, [colors]);

  const openFileDialog = () => fileInputRef.current?.click();

  const handleConvert = async () => {
    if (!selectedFile) return alert("Lütfen önce bir dosya seçin.");
    try {
      const result = await convertPngToSvg(selectedFile, colors[0], simplify[0]);
      setConversionResult(result);
    } catch (err) {
      alert("Dönüştürme sırasında hata: " + err.message);
    }
  };

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
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Dosya yükleme alanı */}
      <div
        className="w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-green-500"
        onClick={openFileDialog}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400" />
        <p className="text-gray-600">Drag & Drop a File</p>
        <Button className="mt-2 bg-green-500 hover:bg-green-600 text-white">
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

      {/* Önizleme Alanı */}
      <div className="flex w-full justify-around items-start space-x-8">
        {/* Sol Alan */}
        <div className="flex flex-col items-center space-y-3">
          {/* Colors & Simplify */}
          <div className="flex space-x-6">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-sm font-medium">Colors</span>
              <div className="flex items-center space-x-1 bg-black text-white rounded px-2">
                <button
                  onClick={() => setColors([Math.max(1, colors[0] - 1)])}
                  className="px-2 py-1"
                >
                  -
                </button>
                <span className="w-6 text-center">{colors[0]}</span>
                <button
                  onClick={() => setColors([Math.min(10, colors[0] + 1)])}
                  className="px-2 py-1"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <span className="text-sm font-medium">Simplify</span>
              <div className="flex items-center space-x-1 bg-black text-white rounded px-2">
                <button
                  onClick={() => setSimplify([Math.max(0, simplify[0] - 1)])}
                  className="px-2 py-1"
                >
                  -
                </button>
                <span className="w-6 text-center">{simplify[0]}</span>
                <button
                  onClick={() => setSimplify([Math.min(10, simplify[0] + 1)])}
                  className="px-2 py-1"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Önizleme resmi */}
          <div
            className="w-64 h-64 border rounded bg-center bg-contain bg-no-repeat"
            style={{
              backgroundImage: `url(${fileBack})`,
            }}
          >
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Palette */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-sm font-medium">Palette</span>
            <div className="flex space-x-2">
              {palette.map((color, i) => (
                <div
                  key={i}
                  onClick={() => handlePickColor(i)}
                  className="w-6 h-6 rounded border cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Convert */}
          <Button
            className="bg-lime-400 hover:bg-lime-500 w-40"
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

        {/* Sağ Alan */}
        <div className="flex flex-col items-center space-y-3">
          <div
            className="w-64 h-64 border rounded bg-center bg-contain bg-no-repeat"
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
          <Button
            className="bg-lime-400 hover:bg-lime-500 w-40"
            onClick={downloadSvg}
            disabled={!conversionResult}
          >
            <Download className="mr-2 h-4 w-4" />
            Download SVG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PngToSvgConverter;
