import React, { useState, useRef } from "react";
import { SketchPicker } from "react-color";
import { Upload, Download } from "lucide-react";
import { useImageConverter } from "../hooks/useImageConverter.js";
import fileBack from "../assets/file_back.png";

const PngToSvgConverter = () => {
  const [colors, setColors] = useState(1);
  const [simplify, setSimplify] = useState(0);
  const [palette, setPalette] = useState(["#bdbdbd"]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const [editingColor, setEditingColor] = useState(null);

  const fileInputRef = useRef(null);
  const { convertPngToSvg, loading } = useImageConverter();

  const handleFile = (file) => {
    setSelectedFile(file);
    setColors(1);
    setPalette(["#bdbdbd"]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const handleConvert = async () => {
    if (!selectedFile) return alert("Please select a file first");
    const result = await convertPngToSvg(selectedFile, colors, simplify);
    setConversionResult(result);
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

  const updatePaletteSize = (newSize) => {
    const size = Math.max(1, Math.min(10, newSize));
    setColors(size);
    if (size > palette.length) {
      setPalette([...palette, ...Array(size - palette.length).fill("#bdbdbd")]);
    } else {
      setPalette(palette.slice(0, size));
    }
  };

  const handleColorChange = (color) => {
    const newPalette = [...palette];
    newPalette[editingColor] = color.hex;
    setPalette(newPalette);
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
          Drag & Drop or Click to Select a PNG/JPG
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
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
                alt="Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 mt-4">
            {/* Colors */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updatePaletteSize(colors - 1)}
                className="bg-black text-white px-2 py-1 rounded"
              >
                -
              </button>
              <span className="text-white bg-black px-3 py-1 rounded text-center w-8">
                {colors}
              </span>
              <button
                onClick={() => updatePaletteSize(colors + 1)}
                className="bg-black text-white px-2 py-1 rounded"
              >
                +
              </button>
            </div>
            {/* Simplify */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSimplify(Math.max(0, simplify - 1))}
                className="bg-black text-white px-2 py-1 rounded"
              >
                -
              </button>
              <span className="text-white bg-black px-3 py-1 rounded text-center w-8">
                {simplify}
              </span>
              <button
                onClick={() => setSimplify(Math.min(10, simplify + 1))}
                className="bg-black text-white px-2 py-1 rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* Palette */}
          <div className="mt-4">
            <p className="text-sm mb-2">Palette</p>
            <div className="flex gap-1">
              {palette.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 border rounded cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => setEditingColor(i)}
                />
              ))}
            </div>
          </div>

          {/* Convert */}
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
          <p className="text-sm mb-1">Colors</p>
          <div
            className="relative w-72 h-72 bg-center bg-contain bg-no-repeat"
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
          {conversionResult?.colors && (
            <div className="flex justify-center mt-2 gap-1">
              {conversionResult.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 border rounded"
                  style={{
                    backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                  }}
                />
              ))}
            </div>
          )}
          <button
            onClick={downloadSvg}
            disabled={!conversionResult}
            className="mt-4 bg-lime-400 px-6 py-2 rounded hover:bg-lime-500"
          >
            <Download className="inline mr-1 h-4 w-4" /> Download SVG
          </button>
        </div>
      </div>

      {/* Color Picker Modal */}
      {editingColor !== null && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-4 rounded shadow">
            <SketchPicker
              color={palette[editingColor]}
              onChange={handleColorChange}
            />
            <button
              onClick={() => setEditingColor(null)}
              className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PngToSvgConverter;
