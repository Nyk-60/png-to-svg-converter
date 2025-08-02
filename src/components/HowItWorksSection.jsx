import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { HelpCircle } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <HelpCircle className="h-6 w-6" />
          <span>Sitenin nasıl çalıştığının biraz daha detaylı anlatımı</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none text-gray-600">
          <p className="mb-4">
            PNG to SVG dönüştürücümüz, gelişmiş görüntü işleme algoritmaları kullanarak 
            raster görüntülerinizi vektör formatına dönüştürür. İşlem tamamen tarayıcınızda 
            gerçekleşir, bu nedenle dosyalarınız güvende kalır.
          </p>
          
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Dönüştürme Süreci:</h3>
          <ul className="space-y-2 mb-4">
            <li><strong>1. Renk Analizi:</strong> Görüntünüzdeki renkler analiz edilir ve dominant renkler belirlenir.</li>
            <li><strong>2. Renk Azaltma:</strong> Seçtiğiniz renk sayısına göre görüntü optimize edilir.</li>
            <li><strong>3. Vektörleştirme:</strong> Her renk katmanı için SVG yolları oluşturulur.</li>
            <li><strong>4. Optimizasyon:</strong> Basitleştirme ayarına göre yollar optimize edilir.</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Özel Özellikler:</h3>
          <ul className="space-y-2">
            <li><strong>Cricut/Silhouette Desteği:</strong> Kesim makineleri için özel katmanlı SVG dosyaları.</li>
            <li><strong>Kayıt İşaretleri:</strong> Doğru hizalama için otomatik kayıt işaretleri.</li>
            <li><strong>Renk Kontrolü:</strong> Her rengi ayrı ayrı düzenleme imkanı.</li>
            <li><strong>Kalite Ayarları:</strong> İhtiyacınıza göre detay seviyesi ayarlama.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default HowItWorksSection;

