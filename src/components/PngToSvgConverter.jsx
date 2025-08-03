import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Upload, Download, Loader2 } from "lucide-react";
import { useImageConverter } from "../hooks/useImageConverter.js";

const PngToSvgConverter = () => {
  const [colors, setColors] = useState(3);
  const [simplify, setSimplify] = useState(0);
  const [palette, setPalette] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const fileInputRef = useRef(null);
  const colorInputRefs = useRef([]);

  const { convertPngToSvg, loading, error } = useImageConverter();

  // Renk analizi (Canvas)
  const extractColors = (imageFile, maxColors = 10) =>
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

        for (let i = 0; i < data.length; i += 4 * 10) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const key = `${r},${g},${b}`;
          colorMap[key] = (colorMap[key] || 0) + 1;
        }

        const sorted = Object.entries(colorMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, maxColors)
          .map((c) => `rgb(${c[0]})`);

        resolve(sorted);
      };

      const url = URL.createObjectURL(imageFile);
      img.src = url;
    });

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const extracted = await extractColors(file, 10);
      setColors(extracted.length || 1);
      setPalette(extracted);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const adjustColors = (delta) => {
    setColors((prev) => {
      let next = Math.max(1, Math.min(10, prev + delta));
      let newPalette = [...palette];

      if (next > newPalette.length) {
        for (let i = newPalette.length; i < next; i++) {
          // Yeni renk mevcut paletten türetilir veya rastgele olur
          const base =
            newPalette[Math.floor(Math.random() * newPalette.length)] || "rgb(200,200,200)";
          const [r, g, b] = base.match(/\d+/g).map(Number);
          const variation = `rgb(${Math.min(r + 20, 255)},${Math.min(
            g + 20,
            255
          )},${Math.min(b + 20, 255)})`;
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
          <div className="grid grid-cols-3 gap-6 items-start">
            {/* Upload */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                selectedFile ? "border-green-400" : "border-gray-300"
              }`}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
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

            {/* Preview + Controls */}
            <div className="text-center">
              <div className="flex justify-center mb-2 space-x-6">
                <div>
                  <label className="text-sm font-medium">Colors</label>
                  <div className="flex items-center space-x-2 justify-center">
                    <Button onClick={() => adjustColors(-1)}>-</Button>
                    <div className="w-8 text-center">{colors}</div>
                    <Button onClick={() => adjustColors(1)}>+</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Simplify</label>
                  <div className="flex items-center space-x-2 justify-center">
                    <Button onClick={() => setSimplify((s) => Math.max(0, s - 1))}>-</Button>
                    <div className="w-8 text-center">{simplify}</div>
                    <Button onClick={() => setSimplify((s) => Math.min(10, s + 1))}>+</Button>
                  </div>
                </div>
              </div>

              {/* Original Preview */}
              {selectedFile && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Original Preview"
                  className="mx-auto border rounded mb-2 w-48 h-48 object-contain"
                />
              )}

              {/* Palette */}
              <div className="flex justify-center space-x-2 mt-2 flex-wrap">
                {palette.map((color, i) => (
                  <div key={i} className="relative">
                    <div
                      className="w-8 h-8 rounded border cursor-pointer"
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

            {/* Result */}
            <div className="text-center">
              {conversionResult?.preview ? (
                <img
                  src={conversionResult.preview}
                  alt="SVG Preview"
                  className="mx-auto border rounded mb-2 w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 border-2 border-dashed mx-auto mb-2 rounded" />
              )}
              {conversionResult && (
                <Button onClick={downloadSvg} className="bg-green-500 text-white hover:bg-green-600">
                  <Download className="mr-2 h-4 w-4" />
                  Download SVG
                </Button>
              )}
            </div>
          </div>

          {/* Convert Button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleConvert}
              disabled={loading || !selectedFile}
              className="bg-lime-500 hover:bg-lime-600 text-white px-8 py-2"
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

          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default PngToSvgConverter;
