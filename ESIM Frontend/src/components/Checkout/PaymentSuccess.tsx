import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {CheckCircle, Download, ImageIcon} from 'lucide-react';

interface PurchaseResult {
    qr_code: string;
    order_details: {
        sold_esim: {
            title: string;
        }
    };
}

interface PaymentSuccessProps {
    activationData: PurchaseResult[];
    downloadQRCode: (qrUrl: string, fileName: string) => void;
}

const QrCodeSkeleton: React.FC = () => (
    <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
        <ImageIcon className="h-10 w-10 text-gray-400" />
    </div>
);

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ activationData, downloadQRCode }) => {
    const [loadedQrCodes, setLoadedQrCodes] = useState<{ [key: string]: boolean }>({});

    const handleImageLoad = (qrUrl: string) => {
        setLoadedQrCodes(prev => ({ ...prev, [qrUrl]: true }));
    };

    return (
        <motion.div
            className="max-w-2xl mx-auto text-center py-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-8">
                <CheckCircle className="h-20 w-20 text-pink-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Ödeme Başarılı!
                </h1>
                <p className="text-gray-600 mb-8">
                    eSIM'leriniz hazırlanıyor. Aktivasyon için aşağıdaki QR kodları kullanabilirsiniz.
                </p>
                <div className="border-t border-pink-100 pt-8 w-full">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">eSIM Aktivasyon Bilgileri</h2>
                    <div className="space-y-6">
                        {activationData.map((purchase, index) => {
                            const isQrLoaded = loadedQrCodes[purchase.qr_code];
                            return (
                                <div key={index} className="bg-gray-50 border border-pink-100 rounded-lg p-4 text-left">
                                    <p className="font-semibold text-gray-800 mb-3">
                                        {purchase.order_details.sold_esim.title}
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="inline-block p-2 bg-white border border-pink-100 rounded-lg shadow-sm">

                                            {!isQrLoaded && <QrCodeSkeleton />}

                                            <img
                                                src={purchase.qr_code}
                                                crossOrigin="anonymous"
                                                alt={`${purchase.order_details.sold_esim.title} QR Kodu`}
                                                className={`w-40 h-40 ${isQrLoaded ? 'block' : 'hidden'}`}
                                                onLoad={() => handleImageLoad(purchase.qr_code)}
                                            />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <p className="text-sm text-gray-600 mb-4">
                                                Bu eSIM'i aktif etmek için QR kodu telefonunuzla tarayın.
                                            </p>

                                            {/* --- YENİ: Koşullu 'disabled' Özelliği --- */}
                                            <button
                                                onClick={() => downloadQRCode(purchase.qr_code, `esim-qr-${index + 1}.png`)}
                                                disabled={!isQrLoaded} // Buton, sadece resim yüklendiğinde aktif olur.
                                                className="inline-flex items-center space-x-2 bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-wait"
                                            >
                                                <Download className="h-4 w-4" />
                                                <span>{isQrLoaded ? 'QR Kodu İndir' : 'Yükleniyor...'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                </div>
                <div className="text-left bg-gray-50 p-4 rounded-lg mt-8">
                    <h3 className="font-semibold text-gray-800 mb-2">Genel Aktivasyon Adımları</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Telefonunuzun Ayarlar menüsüne gidin.</li>
                        <li>'Hücresel' veya 'Mobil Veri' seçeneğini bulun.</li>
                        <li>'Hücresel Plan Ekle' veya 'eSIM Ekle' seçeneğine dokunun.</li>
                        <li>Kameranızla yukarıdaki QR kod(lar)ı tarayın ve adımları izleyin.</li>
                    </ul>
                </div>
                <Link to="/products" className="mt-8 w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-colors inline-block">
                    Yeni eSIM'ler Keşfet
                </Link>
        </motion.div>
    );
};

export default PaymentSuccess;