import React from 'react';
import './App.css'; // CSS'in uygulandığından emin ol
import headeralti from './assets/headeralti.jpg';
import svgtopngimage from './assets/svgyopngimage.jpg';
import PngToSvgConverter from './components/PngToSvgConverter';
import SvgToPngConverter from './components/SvgToPngConverter';

function App() {
  return (
    <div className="App">

      {/* PNG to SVG Section */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>PNG to SVG</h2>
        <img
          src={headeralti}
          alt="PNG to SVG"
          style={{
            display: 'block',
            margin: '0 auto 30px auto',
            width: '800px',
            height: '250px',
            objectFit: 'contain',
            borderRadius: '10px',
          }}
        />
      </div>

      {/* PNG -> SVG Converter */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <PngToSvgConverter />
      </div>

      {/* SVG to PNG Section */}
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>SVG to PNG</h2>
        <img
          src={svgtopngimage}
          alt="SVG to PNG"
          style={{
            display: 'block',
            margin: '0 auto 30px auto',
            width: '800px',
            height: '250px',
            objectFit: 'contain',
            borderRadius: '10px',
          }}
        />
      </div>

      {/* SVG -> PNG Converter */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <SvgToPngConverter />
      </div>

    </div>
  );
}

export default App;
