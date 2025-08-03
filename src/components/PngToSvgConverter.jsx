import React, { useState } from "react";

function PngToSvgConverter() {
  const [image, setImage] = useState(null);
  const [palette, setPalette] = useState([]);
  const [colors, setColors] = useState(9);
  const [simplify, setSimplify] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        setImage(img.src);
        extractColors(img); // Paleti otomatik çıkar
      };
    };
    reader.readAsDataURL(file);
  };

  // Basit renk analizi (ortalama piksel rengi) – geliştirebiliriz
  const extractColors = (img) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, img.width, img.height).data;
    const colorMap = {};

    for (let i = 0; i < data.length; i += 4 * 10) { 
      // 10 px aralıklarla örnek al
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hex = rgbToHex(r, g, b);
      colorMap[hex] = (colorMap[hex] || 0) + 1;
    }

    // En çok tekrar eden ilk 10 rengi al
    const topColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([hex]) => hex);

    setPalette(topColors);
  };

  const rgbToHex = (r, g, b) =>
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-10">
        <div className="flex flex-col items-center">
          <label className="font-medium mb-1">Colors</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setColors(Math.max(1, colors - 1))}>-</button>
            <span>{colors}</span>
            <button onClick={() => setColors(colors + 1)}>+</button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label className="font-medium mb-1">Simplify</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setSimplify(Math.max(0, simplify - 1))}>-</button>
            <span>{simplify}</span>
            <button onClick={() => setSimplify(simplify + 1)}>+</button>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileUpload}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="cursor-pointer text-gray-500 hover:text-blue-500"
        >
          Drag & Drop a File <br /> or <br /> <span className="underline">Choose a File</span>
        </label>
      </div>

      {/* Palette */}
      {palette.length > 0 && (
        <div className="flex justify-center flex-wrap gap-3 mt-4">
          {palette.map((color, index) => (
            <div
              key={index}
              className="w-10 h-10 rounded border shadow"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PngToSvgConverter;
