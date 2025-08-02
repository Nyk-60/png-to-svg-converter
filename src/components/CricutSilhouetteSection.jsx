import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Download, Scissors } from 'lucide-react';

const CricutSilhouetteSection = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Scissors className="h-6 w-6" />
          <span>Cricut and Silhouette Cutting Machines</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Get layered SVG files with registration marks for cutting machines
        </p>
      </CardHeader>
      <CardContent className="text-center">
        <div className="bg-gray-50 rounded-lg p-8 mb-6">
          <div className="text-gray-500 mb-4">
            <div className="text-sm font-medium">Cut SVG oluşan alan</div>
            <div className="text-xs">Her renk ayrı katman olarak</div>
          </div>
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="aspect-square rounded border-2 border-dashed border-gray-300 flex items-center justify-center"
              >
                <div className="w-4 h-4 rounded" style={{ backgroundColor: `hsl(${(i * 60)}, 70%, 50%)` }} />
              </div>
            ))}
          </div>
        </div>
        
        <Button size="lg" className="px-8">
          <Download className="mr-2 h-4 w-4" />
          Download Cut SVG
        </Button>
      </CardContent>
    </Card>
  );
};

export default CricutSilhouetteSection;

