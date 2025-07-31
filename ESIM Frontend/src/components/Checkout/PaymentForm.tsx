import React from 'react';
import { CreditCard, Shield, Mail, Smartphone, User, Lock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentFormState {
    email: string;
    gsm_no: string;
    cardholderFirstName: string;
    cardholderLastName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

interface PaymentFormProps {
    paymentForm: PaymentFormState;
    handleInputChange: (field: keyof PaymentFormState, value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isProcessing: boolean;
    agreedTerms: boolean;
    setAgreedTerms: (value: boolean) => void;
    agreedPrivacy: boolean;
    setAgreedPrivacy: (value: boolean) => void;
    formatPhoneNumber: (value: string) => string;
    formatName: (value: string) => string;
    formatCardNumber: (value: string) => string;
    formatAndValidateExpiryDate: (value: string) => string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
                                                     paymentForm,
                                                     handleInputChange,
                                                     handleSubmit,
                                                     isProcessing,
                                                     agreedTerms,
                                                     setAgreedTerms,
                                                     agreedPrivacy,
                                                     setAgreedPrivacy,
                                                     formatPhoneNumber,
                                                     formatName,
                                                     formatCardNumber,
                                                     formatAndValidateExpiryDate
                                                 }) => {
    return (
        <motion.form
            className="space-y-6 lg:col-span-3"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gray-200 px-6 py-4 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Kişisel Bilgiler</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="email">E-posta Adresiniz <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                                <input id="email" type="email" value={paymentForm.email} onChange={(e) => handleInputChange('email', e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" placeholder="E-posta Adresiniz" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="gsm_no">Telefon Numarası <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                                <input id="gsm_no" type="tel" value={paymentForm.gsm_no} onChange={(e) => handleInputChange('gsm_no', formatPhoneNumber(e.target.value))} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" placeholder="(5XX) XXX XX XX" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gray-200 px-6 py-4 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Ödeme Bilgileri</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="cardholderFirstName">Kart Sahibi Adı <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                                <input id="cardholderFirstName" type="text" value={paymentForm.cardholderFirstName} onChange={(e) => handleInputChange('cardholderFirstName', formatName(e.target.value))} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" placeholder="Adı" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="cardholderLastName">Kart Sahibi Soyadı <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                                <input id="cardholderLastName" type="text" value={paymentForm.cardholderLastName} onChange={(e) => handleInputChange('cardholderLastName', formatName(e.target.value))} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" placeholder="Soyadı" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="cardNumber">Kart Numarası <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                                <input id="cardNumber" type="text" value={paymentForm.cardNumber} onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))} required maxLength={19} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" placeholder="0000 0000 0000 0000" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="expiryDate">Son K. T. <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                                    <input id="expiryDate" type="text" value={paymentForm.expiryDate} onChange={(e) => handleInputChange('expiryDate', formatAndValidateExpiryDate(e.target.value))} required maxLength={5} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" placeholder="AA/YY" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="cvv">CVV <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                                    <input id="cvv" type="text" value={paymentForm.cvv} onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))} required maxLength={3} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" placeholder="CVV" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4">
                            <div className="relative flex items-start gap-3">
                                <div className="flex h-6 items-center">
                                    <input id="terms" type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} className="h-4 w-4 rounded border-pink-300 text-pink-500" />
                                </div>
                                <div className="text-sm leading-6">
                                    <label htmlFor="terms" className="text-gray-700"><a href="/sales-agreement" target="_blank" className="font-medium text-blue-600">Mesafeli Satış Sözleşmesi'ni</a> okudum, anladım ve onaylıyorum.</label>
                                </div>
                            </div>
                            <div className="relative flex items-start gap-3">
                                <div className="flex h-6 items-center">
                                    <input id="privacy" type="checkbox" checked={agreedPrivacy} onChange={(e) => setAgreedPrivacy(e.target.checked)} className="h-4 w-4 rounded border-pink-300 text-pink-500" />
                                </div>
                                <div className="text-sm leading-6">
                                    <label htmlFor="privacy" className="text-gray-700"><a href="/privacy-policy" target="_blank" className="font-medium text-blue-600">KVKK ve Aydınlatma Metni'ni</a> okudum, anladım ve onaylıyorum.</label>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button type="submit" disabled={isProcessing || !agreedTerms || !agreedPrivacy} className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg">
                                {isProcessing ? 'İşleniyor...' : 'Güvenli Ödeme Yap'}
                            </button>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 pt-2">
                            <Shield className="h-4 w-4 text-pink-400" />
                            <span>Ödeme bilgileriniz güvenli ve şifrelidir.</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.form>
    );
};

export default PaymentForm;