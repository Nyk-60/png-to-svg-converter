import React from "react";
import headerImage from "./assets/headeralti.jpg";

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shadow">
        <div className="flex items-center space-x-2">
          <img src="/logo192.png" alt="Logo" className="h-8 w-auto" />
        </div>
        <nav className="flex space-x-6 text-sm font-semibold text-gray-800">
          <a href="#how-it-works" className="hover:text-blue-600">
            HOW IT WORKS
          </a>
          <a href="#free-svg" className="hover:text-blue-600">
            FREE SVG
          </a>
          <a href="#free-png" className="hover:text-blue-600">
            FREE PNG
          </a>
          <a href="#blog" className="hover:text-blue-600">
            BLOG
          </a>
          <a href="#contact" className="hover:text-blue-600">
            CONTACT
          </a>
        </nav>
      </header>

      {/* Header Altı Banner */}
      <div className="flex justify-center my-4">
        <img
          src={headerImage}
          alt="PNG to SVG Banner"
          className="w-auto h-[250px] max-w-[800px] rounded-lg shadow"
        />
      </div>

      {/* Reklam Alanı (Adsense yerleştirilecek, şu an boş) */}
      <div className="flex justify-center my-4">
        <div className="w-[800px] h-[120px] border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          {/* Buraya ileride Adsense script gelecek */}
        </div>
      </div>

      {/* İçerik Alanı */}
      <main className="px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-6">PNG to SVG</h1>
        <p className="text-gray-600 mb-8">
          Select a PNG or JPG from your device, choose the palette size, and
          convert it to SVG with a single click.
        </p>

        {/* Buraya Colors, Simplify ve Upload bileşenleri geliyor */}
        {/* ... */}
      </main>
    </div>
  );
}

export default App;
