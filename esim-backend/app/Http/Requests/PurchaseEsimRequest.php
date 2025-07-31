<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PurchaseEsimRequest extends FormRequest
{
    /**
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('paymentInfo.kartNo')) {
            $this->merge([
                'paymentInfo' => array_merge($this->paymentInfo, [
                    'kartNo' => str_replace([' ', '-'], '', $this->paymentInfo['kartNo']),
                ]),
            ]);
        }
    }

    /**
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'userInfo' => 'required|array',
            'userInfo.email' => 'required|email',
            'userInfo.gsm_no' => 'required|string|min:10',

            'planInfo' => 'required|array',
            'planInfo.api_id' => 'required|array',
            'planInfo.api_id.*' => 'required|string',

            'paymentInfo' => 'required|array',
            'paymentInfo.kartNo' => 'required|string|digits_between:16,19',
            'paymentInfo.kartSahibi' => 'required|string|max:255',
            'paymentInfo.kartSonKullanmaTarihi' => 'required|string|date_format:Y-m-d',
            'paymentInfo.kartCvv' => 'required|string|digits:3',
        ];
    }

    /**
     * Doğrulama hatalarında kullanılacak özel alan adları.
     *
     * @return array
     */
    public function attributes(): array
    {
        return [
            'userInfo.email' => 'E-posta Adresi',
            'userInfo.gsm_no' => 'Telefon Numarası',
            'planInfo.api_id' => 'Plan ID',
            'paymentInfo.kartNo' => 'Kart Numarası',
            'paymentInfo.kartSahibi' => 'Kart Sahibi',
            'paymentInfo.kartSonKullanmaTarihi' => 'Son Kullanma Tarihi',
            'paymentInfo.kartCvv' => 'CVV Kodu',
        ];
    }

    /**
     * Doğrulama kuralları için özel hata mesajları.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'paymentInfo.kartSonKullanmaTarihi.date_format' => ':attribute alanı için lütfen Ay/Yıl (Örn: 02/27) formatında bir tarih giriniz.',
            'required' => ':attribute alanı zorunludur.',
            'email' => ':attribute alanı geçerli bir e-posta adresi olmalıdır.',
            'digits_between' => ':attribute alanı :min ile :max haneli olmalıdır.',
        ];
    }
}
