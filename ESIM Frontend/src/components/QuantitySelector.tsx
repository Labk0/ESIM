import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types';

interface QuantitySelectorProps {
    item: CartItem;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({item}) => {
    const {dispatch} = useCart();

    const handleDecrease = () => {
        if (item.quantity > 1) {
            dispatch({
                type: 'UPDATE_QUANTITY',
                payload: {id: item.id, quantity: item.quantity - 1}
            });
        } else {
            dispatch({type: 'REMOVE_ITEM', payload: item.id});
        }
    };

    const handleIncrease = () => {
        dispatch({
            type: 'UPDATE_QUANTITY',
            payload: {id: item.id, quantity: item.quantity + 1}
        });
    };

    return (
        <div className="flex items-center justify-center bg-white rounded-lg border border-pink-100 shadow-sm">
            <button
                onClick={handleDecrease}
                className="px-3 py-2 text-pink-600 bg-gray-100 hover:bg-gray-200 rounded-l-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-200"
                aria-label="Miktarı azalt"
            >
                <Minus className="h-4 w-4"/>
            </button>

            <span
                className="px-4 py-2 font-bold text-gray-900 w-12 text-center"
                aria-live="polite"
            >
        {item.quantity}
      </span>

            <button
                onClick={handleIncrease}
                className="px-3 py-2 text-pink-600 bg-gray-100 hover:bg-gray-200 rounded-r-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-200"
                aria-label="Miktarı artır"
            >
                <Plus className="h-4 w-4"/>
            </button>
        </div>
    );
};

export default QuantitySelector;