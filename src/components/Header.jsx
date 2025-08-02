import React from 'react';
import { Button } from '@/components/ui/button.jsx';

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">ThingsToSVG</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
              HOME
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
              HOW IT WORKS
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
              FREE SVG
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
              FREE PNG
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
              BLOG
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
              CONTACT
            </Button>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

