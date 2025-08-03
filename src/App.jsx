import React from 'react';
import headeralti from './assets/headeralti.jpg';
import svgtopngimage from './assets/svgyopngimage.jpg';

function App() {
  return (
    <div className="App">

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
            borderRadius: '10px'
          }}
        />
      </div>

      {/* Eski REKLAM GÖRSELİ alanını kaldırabilirsin */}

      {/* SVG to PNG Section */}
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
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
            borderRadius: '10px'
          }}
        />
      </div>

      {/* Buradan sonra mevcut dönüştürme bileşenlerin geliyor */}
    </div>
  );
}

export default App;
