import React, { useState } from 'react';
import { Trash2, ShoppingCart, ArrowRight, Database, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import QuantitySelector from './QuantitySelector';

const SideCart: React.FC = () => {
    const { state, dispatch } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const handleRemoveItem = (itemId: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    };

    const totalItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

    const renderCartItems = () => (
        <div className="space-y-3">
            {state.items.map(item => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-gray-800">{item.country}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1"><Database className="h-3 w-3 text-blue-500" />{item.dataQuota} GB</span>
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-blue-500" />{item.validity} Gün</span>
                            </div>
                        </div>
                        <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} / adet</p>
                        <div className="flex items-center gap-2">
                            <QuantitySelector item={item} />
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                aria-label="Ürünü kaldır"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderCartSummary = () => (
        <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center font-semibold text-gray-900 mb-2">
                <span>Toplam Ürün</span>
                <span>{totalItemCount} adet</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-black">
                <span>Toplam</span>
                <span>${state.total.toFixed(2)}</span>
            </div>
            <Link
                to="/checkout"
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow transition-colors flex items-center justify-center space-x-2"
            >
                <span>Ödemeye Devam Et</span>
                <ArrowRight className="h-4 w-4 text-white" />
            </Link>
        </div>
    );

    const renderEmptyCart = () => (
        <div className="text-center py-10">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Sepetiniz şu an boş.</p>
        </div>
    );

    return (
        <>
            {/* ======================================================================= */}
            {/* == MASAÜSTÜ GÖRÜNÜMÜ == */}
            {/* ======================================================================= */}
            <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-200 sticky top-24">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Sipariş Özeti</h2>
                        {state.items.length > 0 && (
                            <button onClick={handleClearCart} className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
                                Tümünü Kaldır
                            </button>
                        )}
                    </div>
                    {state.items.length > 0 ? (
                        <>
                            {renderCartItems()}
                            {renderCartSummary()}
                        </>
                    ) : renderEmptyCart()}
                </div>
            </div>

            {/* ======================================================================= */}
            {/* == MOBİL GÖRÜNÜM == */}
            {/* ======================================================================= */}

            {/* --- Sabit Alt Bilgi Çubuğu --- */}
            {state.items.length > 0 && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-3 flex items-center z-40">
                    <div className="flex-shrink-0">
                        <ShoppingCart className="h-7 w-7 text-blue-600" />
                    </div>

                    <div className="flex-grow flex items-center justify-between ml-3">
                        <span className="text-base font-semibold text-gray-800">{totalItemCount} plan seçili</span>
                        <p className="text-xl font-extrabold text-green-600 mr-3">${state.total.toFixed(2)}</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-5 rounded-lg shadow-md transition-all"
                    >
                        Sepeti Göster
                    </button>
                </div>
            )}

            {/* --- Sepet Detay Modalı --- */}
            {isModalOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex flex-col" aria-modal="true" role="dialog">
                    <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" onClick={() => setIsModalOpen(false)}></div>

                    <div className="relative mt-auto bg-white rounded-t-2xl flex flex-col max-h-[90vh] animate-slide-up">
                        <div className="flex-shrink-0 p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Sipariş Özeti</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                            {state.items.length > 0 ? (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Seçili Planlar</h3>
                                        <button onClick={handleClearCart} className="text-sm font-medium text-red-600 hover:text-red-800">
                                            Tümünü Kaldır
                                        </button>
                                    </div>
                                    {renderCartItems()}
                                </>
                            ) : renderEmptyCart()}
                        </div>

                        {state.items.length > 0 && (
                            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                                {renderCartSummary()}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SideCart;