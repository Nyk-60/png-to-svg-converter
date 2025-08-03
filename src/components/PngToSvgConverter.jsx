import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Upload, Download, Loader2 } from "lucide-react";
import { useImageConverter } from "../hooks/useImageConverter.js";

const MAX_COLORS = 10;

const PngToSvgConverter = () => {
  const [colors, setColors] = useState(1);
  const [simplify, setSimplify] = useState(0);
  const [palette, setPalette] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const fileInputRef = useRef(null);
  const colorInputRefs = useRef([]);

  const { convertPngToSvg, loading, error } = useImageConverter();

  // Renk analizi
  const extractColors = (imageFile, maxColors = MAX_COLORS) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        const colorMap = {};
        for (let i = 0; i < data.length; i += 4 * 20) {
          const [r, g, b, a] = data.slice(i, i + 4);
          if (a < 128) continue; // Şeffafları atla
          const key = `${r},${g},${b}`;
          colorMap[key] = (colorMap[key] || 0) + 1;
        }

        const sorted = Object.entries(colorMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, maxColors)
          .map((c) => `rgb(${c[0]})`);

        resolve(sorted.length ? sorted : ["rgb(200,200,200)"]);
      };

      const url = URL.createObjectURL(imageFile);
      img.src = url;
    });

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const extracted = await extractColors(file, MAX_COLORS);
      setColors(extracted.length);
      setPalette(extracted);
      setConversionResult(null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const adjustColors = (delta) => {
    setColors((prev) => {
      let next = Math.max(1, Math.min(MAX_COLORS, prev + delta));
      let newPalette = [...palette];

      if (next > newPalette.length) {
        for (let i = newPalette.length; i < next; i++) {
          const base =
            newPalette[Math.floor(Math.random() * newPalette.length)] || "rgb(200,200,200)";
          const [r, g, b] = base.match(/\d+/g).map(Number);
          const variation = `rgb(${Math.min(r + 15, 255)},${Math.min(
            g + 15,
            255
          )},${Math.min(b + 15, 255)})`;
          newPalette.push(variation);
        }
      } else {
        newPalette = newPalette.slice(0, next);
      }

      setPalette(newPalette);
      return next;
    });
  };

  const handleColorChange = (index, color) => {
    const newPalette = [...palette];
    newPalette[index] = color;
    setPalette(newPalette);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      alert("Lütfen önce bir dosya seçin.");
      return;
    }

    try {
      const result = await convertPngToSvg(selectedFile, colors, simplify, palette);
      setConversionResult(result);
    } catch (err) {
      console.error("Conversion error:", err);
      alert("Dönüştürme sırasında bir hata oluştu: " + err.message);
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
    <div className="w-full max-w-5xl mx-auto">
      <Card className="p-6">
        <CardContent>
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center mb-6 ${
              selectedFile ? "border-green-400" : "border-gray-300"
            }`}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-2">Drag & Drop a File</p>
            <Button onClick={openFileDialog} className="bg-green-500 text-white hover:bg-green-600">
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

          {/* Preview & Controls */}
          <div className="grid grid-cols-2 gap-8 items-start">
            {/* Left Column */}
            <div className="flex flex-col items-center space-y-3">
              {/* Controls */}
              <div className="flex space-x-8 justify-center">
                <div className="text-center">
                  <label className="text-sm font-medium block mb-1">Colors</label>
                  <div className="flex items-center space-x-2 justify-center">
                    <Button onClick={() => adjustColors(-1)} className="px-3 py-1 text-lg">-</Button>
                    <div className="w-10 text-center">{colors}</div>
                    <Button onClick={() => adjustColors(1)} className="px-3 py-1 text-lg">+</Button>
                  </div>
                </div>
                <div className="text-center">
                  <label className="text-sm font-medium block mb-1">Simplify</label>
                  <div className="flex items-center space-x-2 justify-center">
                    <Button onClick={() => setSimplify((s) => Math.max(0, s - 1))} className="px-3 py-1 text-lg">-</Button>
                    <div className="w-10 text-center">{simplify}</div>
                    <Button onClick={() => setSimplify((s) => Math.min(10, s + 1))} className="px-3 py-1 text-lg">+</Button>
                  </div>
                </div>
              </div>

              {/* Original Preview */}
              {selectedFile && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Original Preview"
                  className="border rounded w-64 h-64 object-contain"
                />
              )}

              {/* Palette */}
              <div className="w-64">
                <label className="text-sm font-medium block mb-1">Palette</label>
                <div className="grid grid-cols-10 gap-1">
                  {palette.map((color, i) => (
                    <div key={i} className="relative">
                      <div
                        className="w-6 h-6 rounded border cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => colorInputRefs.current[i]?.click()}
                      />
                      <input
                        type="color"
                        ref={(el) => (colorInputRefs.current[i] = el)}
                        className="hidden"
                        value={`#${color
                          .match(/\d+/g)
                          .map((x) => parseInt(x).toString(16).padStart(2, "0"))
                          .join("")}`}
                        onChange={(e) => handleColorChange(i, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Convert Button */}
              <Button
                onClick={handleConvert}
                disabled={loading || !selectedFile}
                className="bg-lime-500 hover:bg-lime-600 text-white w-64 py-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting...
                  </>
                ) : (
                  "Convert"
                )}
              </Button>
            </div>

            {/* Right Column - Result */}
            <div className="flex flex-col items-center space-y-3">
              {conversionResult?.preview ? (
                <img
                  src={conversionResult.preview}
                  alt="SVG Preview"
                  className="border rounded w-64 h-64 object-contain"
                />
              ) : (
                <div className="w-64 h-64 border-2 border-dashed rounded" />
              )}

              <Button
                onClick={downloadSvg}
                disabled={!conversionResult}
                className="bg-lime-500 hover:bg-lime-600 text-white w-64 py-2"
              >
                <Download className="mr-2 h-4 w-4" />
                Download SVG
              </Button>
            </div>
          </div>

          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default PngToSvgConverter;
