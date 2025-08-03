import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PngToSvgConverter from "./components/PngToSvgConverter";
import SvgToPngConverter from "./components/SvgToPngConverter";
import AdSpace from "./components/AdSpace";
import Gallery from "./components/Gallery";
import CricutSilhouetteSection from "./components/CricutSilhouetteSection";
import InfoSection from "./components/InfoSection";
import HowItWorksSection from "./components/HowItWorksSection";

import logo from "./assets/thingstosvg.png";         // Logo
import headerImage from "./assets/headeralti.jpg";   // Header altı görsel

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center py-4 px-6 shadow">
        <div className="flex items-center">
          <img
            src={logo}
            alt="ThingsToSVG"
            className="h-10 w-auto"
          />
        </div>

        <nav className="space-x-6 text-sm font-semibold">
          <a href="#howitworks" className="hover:text-blue-500">HOW IT WORKS</a>
          <a href="#freesvg" className="hover:text-blue-500">FREE SVG</a>
          <a href="#freepng" className="hover:text-blue-500">FREE PNG</a>
          <a href="#blog" className="hover:text-blue-500">BLOG</a>
          <a href="#contact" className="hover:text-blue-500">CONTACT</a>
        </nav>
      </header>

      {/* HEADER ALTI GÖRSEL */}
      <div className="w-full flex justify-center my-4">
        <img
          src={headerImage}
          alt="PNG to SVG Banner"
          className="w-full max-h-[250px] object-cover rounded-lg shadow"
        />
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <AdSpace height="32" />

        <section>
          <h2 className="text-3xl font-bold text-center mb-8">PNG to SVG</h2>
          <PngToSvgConverter />
        </section>

        <CricutSilhouetteSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AdSpace height="64" />
          <AdSpace height="64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Gallery title="FREE SVG gallery" type="svg" />
          <Gallery title="FREE PNG gallery" type="png" />
        </div>

        <section>
          <h2 className="text-3xl font-bold text-center mb-8">SVG to PNG</h2>
          <SvgToPngConverter />
        </section>

        <InfoSection />
        <HowItWorksSection />
        <AdSpace height="32" />
      </main>

      <Footer />
    </div>
  );
}

export default App;
