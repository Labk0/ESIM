import React from 'react';
import { Database, Calendar, Plus, Globe } from 'lucide-react';
import { eSIM } from '../types';
import { useCart } from '../context/CartContext';
import QuantitySelector from './QuantitySelector';

interface ProductListItemProps {
    esim: eSIM;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ esim }) => {
    const { state, dispatch } = useCart();
    const cartItem = state.items.find(item => item.id === esim.id);

    const handleAddToCart = () => {
        dispatch({ type: 'ADD_ITEM', payload: esim });
    };

    const actionArea = (
        <div className="w-32 h-10 flex items-center justify-end">
            {cartItem ? (
                <QuantitySelector item={cartItem} />
            ) : (
                <button
                    onClick={handleAddToCart}
                    className="w-10 h-10 flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    aria-label="Sepete ekle"
                >
                    <Plus className="h-5 w-5" />
                </button>
            )}
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-md border border-pink-100 hover:shadow-lg transition-shadow duration-200">
            <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                <div className="flex items-center gap-4">
                    <img
                        src="https://cdn.pocketesim.com/img/logo.svg"
                        alt="eSIM Logo"
                        className="h-16 w-16 sm:h-16 sm:w-32 object-contain flex-shrink-0"
                    />
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{esim.country}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 mt-1">
                            <p className="flex items-center gap-1.5">
                                <Database className="h-4 w-4 text-blue-500" />
                                <span>{esim.dataQuota ? `${esim.dataQuota} GB` : 'Sınırsız'}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span>{esim.validity} Gün</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        ${esim.price.toFixed(2)}
                    </div>
                    {actionArea}
                </div>
            </div>

            <div className="flex flex-col justify-between p-4 sm:hidden min-h-[170px]">
                <div className="mb-3">
                    <img
                        src="https://cdn.pocketesim.com/img/logo.svg"
                        alt="eSIM Logo"
                        className="h-12 w-auto object-contain"
                    />
                </div>
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-gray-700">
                    <p className="flex items-center gap-1.5 font-bold">
                        <Globe className="h-4 w-4 text-blue-500" />
                        <span>{esim.country}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                        <Database className="h-4 w-4 text-blue-500" />
                        <span>{esim.dataQuota ? `${esim.dataQuota} GB` : 'Sınırsız'}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{esim.validity} Gün</span>
                    </p>
                </div>
                <div className="flex items-end justify-between mt-2">
                    <div className="text-2xl font-bold text-gray-900">
                        ${esim.price.toFixed(2)}
                    </div>
                    {actionArea}
                </div>
            </div>
        </div>
    );
};

export default ProductListItem;