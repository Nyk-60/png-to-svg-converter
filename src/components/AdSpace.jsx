import React from 'react';

const AdSpace = ({ width = "full", height = "32", className = "" }) => {
  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${width === "full" ? "w-full" : `w-${width}`} h-${height} ${className}`}>
      <div className="text-center text-gray-500">
        <div className="text-sm font-medium">REKLAM GÖRSELİ</div>
        <div className="text-xs">YERLEŞİM ALANI</div>
      </div>
    </div>
  );
};

export default AdSpace;

