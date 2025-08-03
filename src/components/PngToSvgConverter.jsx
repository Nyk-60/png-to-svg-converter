import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Download, Upload, Loader2 } from "lucide-react";
import { useImageConverter } from "../hooks/useImageConverter.js";
import fileBack from "../assets/file_back.png";

const MAX_COLORS = 10;

const PngToSvgConverter = () => {
  const [colors, setColors] = useState(1);
  const [simplify, setSimplify] = useState(0);
  const [palette, setPalette] = useState(["#bfbfbf"]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { convertPngToSvg } = useImageConverter();

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      detectColors(file);
    }
  };

  const detectColors = (file) => {
    // Basit renk algılama: Gerçek projede color-thief veya vibrant kullanılabilir
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (ev) => {
      img.src = ev.target.result;
    };
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, 0, img.width, img.height).data;
      const colorsFound = {};
      for (let i = 0; i < data.length; i += 4) {
        const key = `${data[i]},${data[i + 1]},${data[i + 2]}`;
        colorsFound[key] = (colorsFound[key] || 0) + 1;
      }

      const sorted = Object.entries(colorsFound)
        .sort((a, b) => b[1] - a[1])
        .slice(0, MAX_COLORS);

      const detectedColors = sorted.map(([rgb]) => {
        const [r, g, b] = rgb.split(",");
        return `rgb(${r},${g},${b})`;
      });

      setColors(detectedColors.length);
      setPalette(detectedColors);
    };
    reader.readAsDataURL(file);
  };

  const handleColorChange = (index) => {
    const input = document.createElement("input");
    input.type = "color";
    input.value = rgbToHex(palette[index]);
    input.click();
    input.oninput = (e) => {
      const newPalette = [...palette];
      newPalette[index] = e.target.value;
      setPalette(newPalette);
    };
  };

  const rgbToHex = (rgb) => {
    const result = rgb.match(/\d+/g);
    if (!result) return "#000000";
    return (
      "#" +
      result
        .map((x) => {
          const hex = parseInt(x).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const adjustColors = (newCount) => {
    if (newCount < 1) newCount = 1;
    if (newCount > MAX_COLORS) newCount = MAX_COLORS;
    setColors(newCount);

    if (newCount > palette.length) {
      setPalette([
        ...palette,
        ...Array(newCount - palette.length).fill("#bfbfbf"),
      ]);
    } else {
      setPalette(palette.slice(0, newCount));
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    setLoading(true);
    try {
      const result = await convertPngToSvg(selectedFile, colors, simplify);
      setConversionResult(result);
    } catch (err) {
      alert("Conversion failed: " + err.message);
    }
    setLoading(false);
  };

  const downloadSvg = () => {
    if (!conversionResult?.svg) return;
    const blob = new Blob([conversionResult.svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.svg";
    a.click();
    URL.revokeObjectURL(url);
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
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <div className="flex justify-center gap-16 w-full max-w-5xl mt-4">
        {/* LEFT COLUMN */}
        <div className="flex flex-col items-center">
          <div className="flex gap-6 mb-2">
            {/* Colors */}
            <div className="flex items-center space-x-2">
              <Button onClick={() => adjustColors(colors - 1)}>-</Button>
              <span>{colors}</span>
              <Button onClick={() => adjustColors(colors + 1)}>+</Button>
            </div>
            {/* Simplify */}
            <div className="flex items-center space-x-2">
              <Button onClick={() => setSimplify(Math.max(0, simplify - 1))}>
                -
              </Button>
              <span>{simplify}</span>
              <Button onClick={() => setSimplify(Math.min(10, simplify + 1))}>
                +
              </Button>
            </div>
          </div>

          {/* Input Image */}
          <div className="relative w-64 h-64 border rounded-lg overflow-hidden">
            <img src={fileBack} className="absolute inset-0 w-full h-full" />
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
          </div>

          {/* Palette */}
          <div className="mt-2 text-sm font-medium">Palette</div>
          <div className="flex gap-2 mt-1">
            {palette.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded cursor-pointer border"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(i)}
              />
            ))}
          </div>

          {/* Convert */}
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
          <div className="text-sm font-medium mb-2">Colors</div>
          <div className="relative w-64 h-64 border rounded-lg overflow-hidden">
            <img src={fileBack} className="absolute inset-0 w-full h-full" />
            {conversionResult?.preview && (
              <img
                src={conversionResult.preview}
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
          </div>

          {conversionResult && (
            <div className="flex gap-2 mt-2">
              {palette.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded cursor-pointer border"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(i)}
                />
              ))}
            </div>
          )}

          <Button
            className="mt-3 bg-lime-400 hover:bg-lime-500"
            onClick={downloadSvg}
            disabled={!conversionResult}
          >
            <Download className="mr-2 h-4 w-4" /> Download SVG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PngToSvgConverter;
