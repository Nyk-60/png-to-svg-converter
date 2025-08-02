import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const Gallery = ({ title, type = "svg" }) => {
  const sampleItems = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Sample ${type.toUpperCase()} ${i + 1}`,
    preview: `https://via.placeholder.com/200x150/4F46E5/FFFFFF?text=${type.toUpperCase()}+${i + 1}`
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sampleItems.map((item) => (
            <div key={item.id} className="group relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                  <span className="text-white font-medium text-sm">{item.title}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                <Button size="sm" variant="secondary">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-center mt-2 text-gray-600">{item.title}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Gallery;

