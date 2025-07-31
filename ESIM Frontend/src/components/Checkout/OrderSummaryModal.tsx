// src/components/OrderSummaryModal.tsx

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import OrderSummary from './OrderSummary.tsx';

interface OrderSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-end"
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-50 rounded-t-2xl p-4 w-full max-w-lg"
                    >
                        <div className="flex justify-end mb-2">
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                                <X className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>
                        <OrderSummary />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OrderSummaryModal;