import { useState } from 'react';
// API_BASE_URL'i ortam değişkeninden al
// Eğer VITE_API_BASE_URL tanımlı değilse (yerel geliştirme ortamı gibi), 
// yerel sunucu adresini kullan (http://localhost:5000 )
// Aksi takdirde, boş bırak (Vercel'de göreceli yollar çalışır)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                   (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '' );

export const useImageConverter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const convertPngToSvg = async (file, colors = 8, simplify = 0) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('colors', colors.toString());
      formData.append('simplify', simplify.toString());

      const response = await fetch(`${API_BASE_URL}/api/convert-png-to-svg`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Conversion failed');
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const convertSvgToPng = async (svgContent, width = 400, height = 400) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/convert-svg-to-png', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          svg: svgContent,
          width,
          height,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Conversion failed');
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const extractColors = async (file, colors = 8) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('colors', colors.toString());

      const response = await fetch('/api/extract-colors', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Color extraction failed');
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    convertPngToSvg,
    convertSvgToPng,
    extractColors,
    loading,
    error,
  };
};

