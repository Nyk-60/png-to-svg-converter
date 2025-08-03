import React from 'react';
import headeralti from './assets/headeralti.jpg';
import svgtopngimage from './assets/svgyopngimage.jpg';

function App() {
  return (
    <div className="App" style={{ fontFamily: 'sans-serif' }}>

      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 30px',
          borderBottom: '1px solid #eee',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo192.png" alt="Logo" style={{ height: '40px' }} />
        </div>

        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '30px', margin: 0, padding: 0 }}>
            <li><a href="#" style={{ textDecoration: 'none', color: '#000' }}>HOME</a></li>
            <li><a href="#" style={{ textDecoration: 'none', color: '#000' }}>HOW IT WORKS</a></li>
            <li><a href="#" style={{ textDecoration: 'none', color: '#000' }}>FREE SVG</a></li>
            <li><a href="#" style={{ textDecoration: 'none', color: '#000' }}>FREE PNG</a></li>
            <li><a href="#" style={{ textDecoration: 'none', color: '#000' }}>BLOG</a></li>
            <li><a href="#" style={{ textDecoration: 'none', color: '#000' }}>CONTACT</a></li>
          </ul>
        </nav>
      </header>

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

      {/* PNG to SVG Converter Placeholder */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h3>PNG to SVG Converter Component</h3>
        {/* Buraya PNG -> SVG dönüştürme bileşeniniz gelecek */}
      </div>

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

      {/* SVG to PNG Converter Placeholder */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h3>SVG to PNG Converter Component</h3>
        {/* Buraya SVG -> PNG dönüştürme bileşeniniz gelecek */}
      </div>

      {/* Footer */}
      <footer style={{ marginTop: '80px', textAlign: 'center', padding: '20px', borderTop: '1px solid #eee' }}>
        <p>© 2025 ThingsToSVG - All Rights Reserved.</p>
      </footer>

    </div>
  );
}

export default App;
