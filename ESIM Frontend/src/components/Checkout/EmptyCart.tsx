import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

const EmptyCart: React.FC = () => {
    return (
        <div className="text-center py-20">
            <CreditCard className="h-16 w-16 mx-auto mb-4 text-pink-200" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Ödeme Yapılacak Ürün Yok
            </h2>
            <p className="text-gray-600 mb-6">Lütfen önce sepetinize bir eSIM ekleyin.</p>
            <Link to="/products" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                eSIM'lere Göz At
            </Link>
        </div>
    );
};

export default EmptyCart;