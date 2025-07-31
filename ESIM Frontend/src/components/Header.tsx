import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone } from 'lucide-react';

const Header: React.FC = () => {
  return (
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Smartphone className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">eSIM Mağazası</span>
            </Link>

            <nav className="flex items-center space-x-8">
              <Link
                  to="/products"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Ürünler
              </Link>
            </nav>
          </div>
        </div>
      </header>
  );
};

export default Header;