// src/components/OrderSummary.tsx

import React from 'react';
import { useCart } from '../../context/CartContext.tsx';
import { Database, Calendar } from 'lucide-react';

const OrderSummary: React.FC = () => {
    const { state } = useCart();
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

    if (state.items.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">Sipariş Özeti</h2>
            <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-6">
                <div className="space-y-4">
                    {state.items.map((item) => (
                        <div key={item.id}
                             className="flex flex-col gap-2 border-b border-pink-100 pb-3 last:border-b-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.country}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><Database
                                            className="h-3 w-3 text-blue-500"/>{item.dataQuota} GB</span>
                                        <span className="flex items-center gap-1"><Calendar
                                            className="h-3 w-3 text-blue-500"/>{item.validity} Gün</span>
                                    </div>
                                </div>
                                <div
                                    className="font-bold text-gray-900 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500">${item.price.toFixed(2)} / adet</p>
                                <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-pink-100 pt-4 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Toplam Ürün</span>
                        <span>{itemCount} adet</span>
                    </div>
                    <div
                        className="border-t border-pink-100 pt-3 mt-3 flex justify-between items-center text-xl font-bold text-gray-900">
                        <span>Genel Toplam</span>
                        <span>${state.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary; // Değişiklik burada