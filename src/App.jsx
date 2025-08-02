import React from 'react'
import Header from './components/Header.jsx'
import AdSpace from './components/AdSpace.jsx'
import PngToSvgConverter from './components/PngToSvgConverter.jsx'
import CricutSilhouetteSection from './components/CricutSilhouetteSection.jsx'
import Gallery from './components/Gallery.jsx'
import SvgToPngConverter from './components/SvgToPngConverter.jsx'
import InfoSection from './components/InfoSection.jsx'
import HowItWorksSection from './components/HowItWorksSection.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Top Ad Space */}
        <AdSpace height="32" />
        
        {/* Main PNG to SVG Converter */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">PNG to SVG</h2>
          <PngToSvgConverter />
        </section>
        
        {/* Cricut and Silhouette Section */}
        <section>
          <CricutSilhouetteSection />
        </section>
        
        {/* Side Ad Spaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AdSpace height="64" />
          <AdSpace height="64" />
        </div>
        
        {/* Galleries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Gallery title="FREE SVG gallery" type="svg" />
          <Gallery title="FREE PNG gallery" type="png" />
        </div>
        
        {/* SVG to PNG Converter */}
        <section>
          <SvgToPngConverter />
        </section>
        
        {/* Info Section */}
        <section>
          <InfoSection />
        </section>
        
        {/* How It Works */}
        <section>
          <HowItWorksSection />
        </section>
        
        {/* Bottom Ad Space */}
        <AdSpace height="32" />
      </main>
      
      <Footer />
    </div>
  )
}

export default App
