import React from 'react';
import headeralti from './assets/headeralti.jpg';
import svgtopngimage from './assets/svgyopngimage.jpg';
import PngToSvgConverter from './components/PngToSvgConverter';
import SvgToPngConverter from './components/SvgToPngConverter';

function App() {
  return (
    <div className="App" style={{ fontFamily: 'sans-serif' }}>

      {/* PNG to SVG Section */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>PNG to SVG</h2>
        <img
          src={headeralti}
          alt="PNG to SVG"
          style={{
            display: 'block',
            margin: '0 auto',
            width: '800px',
            height: '250px',
            objectFit: 'contain',
            borderRadius: '10px',
          }}
        />
      </div>

      {/* Mevcut PNG -> SVG Converter */}
      <PngToSvgConverter />

      {/* SVG to PNG Section */}
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>SVG to PNG</h2>
        <img
          src={svgtopngimage}
          alt="SVG to PNG"
          style={{
            display: 'block',
            margin: '0 auto',
            width: '800px',
            height: '250px',
            objectFit: 'contain',
            borderRadius: '10px',
          }}
        />
      </div>

      {/* Mevcut SVG -> PNG Converter */}
      <SvgToPngConverter />

    </div>
  );
}

export default App;
