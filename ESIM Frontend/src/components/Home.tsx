import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi } from 'lucide-react';

const Home: React.FC = () => {
    return (
        <div className="text-center py-20 sm:py-32">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
                <Wifi className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                Dünyaya Bağlanmanın En Kolay Yolu
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                Yurt dışı seyahatlerinizde fahiş roaming ücretlerine son. Size en uygun eSIM planını seçin, anında aktif edin ve kesintisiz internetin keyfini çıkarın.
            </p>
            <div className="mt-10">
                <Link
                    to="/products"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105"
                >
                    eSIM Planlarını Keşfet
                </Link>
            </div>
        </div>
    );
};

export default Home;