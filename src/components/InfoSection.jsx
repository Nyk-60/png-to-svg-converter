import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { FileText, Image } from 'lucide-react';

const InfoSection = () => {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* SVG Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>SVG dosya nedir?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed">
            SVG (Scalable Vector Graphics), vektör tabanlı bir grafik formatıdır. 
            Piksel tabanlı görüntülerin aksine, SVG dosyaları matematiksel formüller 
            kullanarak şekilleri tanımlar. Bu sayede herhangi bir boyutta kalite 
            kaybı olmadan ölçeklendirilebilir. Web tasarımı, logo tasarımı ve 
            baskı işleri için idealdir.
          </p>
        </CardContent>
      </Card>

      {/* PNG Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Image className="h-5 w-5" />
            <span>PNG dosya nedir?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed">
            PNG (Portable Network Graphics), kayıpsız sıkıştırma kullanan bir 
            raster görüntü formatıdır. Şeffaflığı destekler ve web'de yaygın 
            olarak kullanılır. Fotoğraflar ve karmaşık görüntüler için JPEG'e 
            göre daha büyük dosya boyutları oluşturur, ancak kalite kaybı yoktur.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoSection;

