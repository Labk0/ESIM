import axios from 'axios';
import { CartItem, eSIM } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export interface CountriesResponse {
  popular: { ulkeAd: string; ulkeKodu: string }[];
  all: { ulkeAd: string; ulkeKodu: string }[];
}

export const getCountries = async (): Promise<CountriesResponse> => {
  try {
    const response = await api.get('/countries');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw new Error('Ülke verileri alınamadı.');
  }
};

export const getPlansForCountry = async (countryCode: string, countryName: string): Promise<eSIM[]> => {
  try {
    const response = await api.get(`/plans/${countryCode}`);
    if (!response.data.coverages) return [];

    return response.data.coverages
        .filter((plan: any) => plan && plan.api_id)
        .map((plan: any): eSIM => ({
          id: plan.api_id.toString(),
          api_id: plan.api_id.toString(),
          country: plan.coverage,
          countryCode: plan.code.toUpperCase(),
          dataQuota: parseFloat(plan.data_amount),
          validity: parseInt(plan.validity_period, 10),
          price: parseFloat(plan.amount),
          currency: plan.currency,
          description: plan.title,
        }));
  } catch (error) {
    console.error(`Error fetching plans for ${countryCode}:`, error);
    throw new Error(`${countryName} için paketler alınamadı.`);
  }
};

// Ödeme fonksiyonu düzeltildi
export const processPayment = async (paymentData: any, cartItems: CartItem[]): Promise<any> => {
  try {
    const apiIds: string[] = [];
    cartItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        apiIds.push(item.id);
      }
    });

    const payload = {
      userInfo: {
        email: paymentData.userInfo.email,
        gsm_no: paymentData.userInfo.gsm_no,
      },
      planInfo: {
        api_id: apiIds,
      },
      paymentInfo: {
        kartNo: paymentData.paymentInfo.kartNo,
        kartSahibi: paymentData.paymentInfo.kartSahibi,
        kartSonKullanmaTarihi: paymentData.paymentInfo.kartSonKullanmaTarihi,
        kartCvv: paymentData.paymentInfo.kartCvv,
      },
    };

    const response = await api.post('/purchase', payload);
    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data.message || 'Ödeme işlemi başarısız oldu.';
      const providerError = error.response.data.provider_error?.message;
      throw new Error(providerError ? `${errorMessage}: ${providerError}`: errorMessage);
    }
    throw new Error('Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.');
  }
};