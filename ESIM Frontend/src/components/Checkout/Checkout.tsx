import React, { useState } from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { processPayment } from '../../services/api';
import { motion } from 'framer-motion';

import EmptyCart from './EmptyCart';
import OrderSummary from './OrderSummary';
import PaymentSuccess from './PaymentSuccess';
import PaymentForm from './PaymentForm';
import OrderSummaryModal from "./OrderSummaryModal";

interface PurchaseResult {
  qr_code: string;
  order_details: { sold_esim: { title: string; } };
}

const Checkout: React.FC = () => {
  const { state, dispatch } = useCart();
  const [isCompleted, setIsCompleted] = useState(false);
  const [activationData, setActivationData] = useState<PurchaseResult[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentForm, setPaymentForm] = useState({
    email: '',
    gsm_no: '',
    cardholderFirstName: '',
    cardholderLastName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const handleInputChange = (field: keyof typeof paymentForm, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!paymentForm.email.trim()) {
      return "E-posta Adresi alanı zorunludur.";
    }
    if (!/^\S+@\S+\.\S+$/.test(paymentForm.email)) {
      return "Lütfen geçerli bir e-posta adresi giriniz.";
    }

    if (paymentForm.gsm_no.replace(/\D/g, '').length < 10) {
      return "Telefon Numarası alanı zorunludur.";
    }

    if (!paymentForm.cardholderFirstName.trim() || !paymentForm.cardholderLastName.trim()) {
      return "Kart Sahibi Adı ve Soyadı alanları zorunludur.";
    }

    if (paymentForm.cardNumber.replace(/\s/g, '').length < 16) {
      return "Kart Numarası 16 haneli olmalıdır.";
    }

    if (!paymentForm.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.expiryDate)) {
      return "Son Kullanma Tarihi alanı AA/YY formatında zorunludur.";
    }

    const [monthStr, yearStr] = paymentForm.expiryDate.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(`20${yearStr}`, 10);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "Geçmiş tarihli kart kullanılamaz.";
    }

    if (!paymentForm.cvv || paymentForm.cvv.length < 3) {
      return "CVV kodu en az 3 haneli olmalıdır.";
    }

    if (!agreedTerms || !agreedPrivacy) {
      return "Lütfen devam etmek için tüm sözleşmeleri onaylayın.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Bu veri oluşturma kısmı doğru.
    const submissionData = {
      userInfo: {
        email: paymentForm.email,
        gsm_no: paymentForm.gsm_no.replace(/\D/g, ''),
      },
      planInfo: {
        api_id: state.items.map(item => item.api_id)
      },
      paymentInfo: {
        kartNo: paymentForm.cardNumber.replace(/\s/g, ''),
        kartSahibi: `${paymentForm.cardholderFirstName.trim()} ${paymentForm.cardholderLastName.trim()}`,
        kartSonKullanmaTarihi: `20${paymentForm.expiryDate.split('/')[1]}-${paymentForm.expiryDate.split('/')[0]}-01`,
        kartCvv: paymentForm.cvv,
      },
    };

    try {
      const paymentResponse = await processPayment(submissionData, state.items);

      // --- DÜZELTME BURADA ---
      // Backend'den gelen yanıtın içindeki "data" objesine ve onun içindeki "purchases" dizisine erişiyoruz.
      if (paymentResponse.data && paymentResponse.data.purchases && Array.isArray(paymentResponse.data.purchases)) {
        setActivationData(paymentResponse.data.purchases);
      }

      setIsCompleted(true);
      dispatch({ type: 'CLEAR_CART' });

    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        const backendErrors = err.response.data.errors;
        const firstError = Object.values(backendErrors).flat()[0] as string;
        setError(firstError || "Lütfen formdaki bilgileri kontrol edin.");
      } else {
        setError(err.message || 'Ödeme işlemi sırasında bilinmeyen bir hata oluştu.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 10);
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    if (!match) return cleaned;
    return [match[1] ? `(${match[1]}` : '', match[2] ? `) ${match[2]}` : '', match[3] ? ` ${match[3]}` : '', match[4] ? ` ${match[4]}` : ''].join('');
  };

  const formatName = (value: string) => {
    return value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s]/g, '');
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    let cleanValue = value.replace(/\D/g, '');

    // Kullanıcı 2-9 arası bir rakamla başlarsa, başına '0' ekle (örn: 3 -> 03)
    if (cleanValue.length === 1 && cleanValue > '1') {
      cleanValue = '0' + cleanValue;
    }

    if (cleanValue.length >= 2) {
      const month = parseInt(cleanValue.substring(0, 2), 10);
      if (month === 0) { // 00 girilirse, 0'a geri çevir ki kullanıcı düzeltebilsin
        cleanValue = '01';
      } else if (month > 12) {
        cleanValue = '12'; // 12'den büyükse 12 yap
      }
    }

    // 2 haneden sonra otomatik olarak '/' ekle ve uzunluğu 5 karakterle sınırla (AA/YY)
    if (cleanValue.length > 2) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
    }

    return cleanValue;
  };

  const downloadQRCode = (qrUrl: string, fileName: string) => {
    const imageElement = document.querySelector(`img[src="${qrUrl}"]`) as HTMLImageElement | null;
    if (!imageElement || !imageElement.complete) {
      window.open(qrUrl, '_blank');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(imageElement, 0, 0);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  if (state.items.length === 0 && !isCompleted) {
    return <EmptyCart />;
  }

  if (isCompleted && activationData.length > 0) {
    return <PaymentSuccess activationData={activationData} downloadQRCode={downloadQRCode} />;
  }

  return (
      <>
        <motion.div
            className="max-w-6xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
          <div className="my-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Ödeme</h1>
          </div>

          {error && (
              <div className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-4 mb-6 rounded-md flex items-center gap-3" role="alert">
                <AlertTriangle className="h-5 w-5 text-pink-500"/>
                <p className="font-bold">{error}</p>
              </div>
          )}

          <div className="lg:hidden mb-6">
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center" onClick={() => setIsModalOpen(true)} role="button" tabIndex={0}>
                <div><span className="font-semibold text-gray-800">{itemCount} Plan Seçildi</span></div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">${state.total.toFixed(2)}</span>
                  <ChevronDown className="h-5 w-5 text-pink-500 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <PaymentForm
                paymentForm={paymentForm}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isProcessing={isProcessing}
                agreedTerms={agreedTerms}
                setAgreedTerms={setAgreedTerms}
                agreedPrivacy={agreedPrivacy}
                setAgreedPrivacy={setAgreedPrivacy}
                formatPhoneNumber={formatPhoneNumber}
                formatName={formatName}
                formatCardNumber={formatCardNumber}
                formatAndValidateExpiryDate={formatExpiryDate}
            />
            <div className="hidden lg:block lg:col-span-2 space-y-4 lg:sticky lg:top-24">
              <OrderSummary />
            </div>
          </div>
        </motion.div>
        <OrderSummaryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
  );
};

export default Checkout;