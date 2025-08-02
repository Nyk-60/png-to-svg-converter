import React from 'react';
import { Button } from '@/components/ui/button.jsx';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-600 text-sm">
              2025 Copyright thingstosvg.com
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Button variant="link" className="text-gray-600 hover:text-gray-900 p-0">
              Privacy Policy
            </Button>
            <Button variant="link" className="text-gray-600 hover:text-gray-900 p-0">
              Terms of Service
            </Button>
            <Button variant="link" className="text-gray-600 hover:text-gray-900 p-0">
              FAQ
            </Button>
            <Button variant="link" className="text-gray-600 hover:text-gray-900 p-0">
              Blog
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

