<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\EsimApiException;
use App\Http\Controllers\Controller;
use App\Http\Requests\PurchaseEsimRequest;
use App\Services\EsimService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class EsimController extends Controller
{
    protected EsimService $esimService;

    public function __construct(EsimService $esimService)
    {
        $this->esimService = $esimService;
    }

    public function getCountries()
    {
        $countriesData = $this->esimService->getAvailableCountries();

        if (!$countriesData) {
            return response()->json(['message' => 'Ülkeler alınamadı.'], 502);
        }

        $popularCountryNames = ["Avrupa Ülkeleri", "Yunanistan", "İspanya", "Amerika Birleşik Devletleri"];
        $allCountries = collect($countriesData);

        $popularCountries = $allCountries->whereIn('ulkeAd', $popularCountryNames)->values();

        return response()->json([
            'popular' => $popularCountries,
            'all' => $allCountries->sortBy('ulkeAd')->values(),
        ]);
    }

    public function getPlans($countryCode)
    {
        $plans = $this->esimService->getPlansByCountryCode($countryCode);

        return response()->json([
            'coverages' => $plans
        ]);
    }

    public function purchase(PurchaseEsimRequest $request): JsonResponse
    {
        $validatedData = $request->validated();
        $successfulPurchases = [];
        $failedPurchases = [];

        try {
            // satışları oluştur
            $pendingSalesData = $this->esimService->createPendingSale([
                'api_id' => $validatedData['planInfo']['api_id'],
                'gsm_no' => $validatedData['userInfo']['gsm_no'],
                'email'  => $validatedData['userInfo']['email'],
            ]);

            $soldEsimsArray = data_get($pendingSalesData, 'sold_esim', []);
            $soldEsimsArray = isset($soldEsimsArray[0]) ? $soldEsimsArray : [$soldEsimsArray];

            // satışı onayla ve ödemeyi yap
            foreach ($soldEsimsArray as $esim) {
                $soldEsimId = data_get($esim, 'id');
                if (!$soldEsimId) {
                    $failedPurchases[] = [
                        'id' => null,
                        'reason' => 'Bekleyen satış verisinden ID alınamadı.'
                    ];
                    continue;
                }

                $confirmData = $this->esimService->confirmPayment([
                    'id'                     => $soldEsimId,
                    'kartNo'                 => $validatedData['paymentInfo']['kartNo'],
                    'kartSahibi'             => $validatedData['paymentInfo']['kartSahibi'],
                    'kartSonKullanmaTarihi'  => $validatedData['paymentInfo']['kartSonKullanmaTarihi'],
                    'kartCvv'                => $validatedData['paymentInfo']['kartCvv'],
                    'taksitSayisi'           => 1,
                ]);

                // API yanıtından QR kodunu ve diğer detayları güvenle al
                $qrCode = data_get($confirmData, 'sold_esim.parameters.data.0.esimDetail.0.qr_code');

                if ($qrCode) {
                    $successfulPurchases[] = [
                        'id'            => $soldEsimId,
                        'qr_code'       => $qrCode,
                        'package_name'  => data_get($confirmData, 'sold_esim.package_name', 'Bilinmeyen Paket'),
                        'price'         => data_get($confirmData, 'sold_esim.price', 0),
                        'currency'      => data_get($confirmData, 'sold_esim.currency', 'TRY'),
                        'order_details' => $confirmData,
                    ];
                } else {
                    $failedPurchases[] = [
                        'id' => $soldEsimId,
                        'reason' => 'Ödeme başarılı fakat API yanıtından QR kod bilgisi alınamadı.',
                        'provider_response' => $confirmData
                    ];
                }
            }

        } catch (EsimApiException $e) {
            Log::error('eSIM işleminde kritik API hatası: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage(),
                'details' => $e->errorData ?? null
            ], $e->getCode() ?: 502);
        }

        // değerlendir yanıt oluştur
        if (empty($successfulPurchases)) {
            return response()->json([
                'status'  => 'failure',
                'message' => 'Tüm ürünler için satın alma işlemi başarısız oldu.',
                'data' => [
                    'successful_count' => 0,
                    'failed_count' => count($failedPurchases),
                    'failures' => $failedPurchases,
                ]
            ], 400);
        }

        $responseMessage = sprintf(
            '%d adet eSIM başarıyla satın alındı.',
            count($successfulPurchases)
        );

        if (!empty($failedPurchases)) {
            $responseMessage .= sprintf(
                ' %d adet işlemde ise hata oluştu.',
                count($failedPurchases)
            );
        }

        return response()->json([
            'status'    => 'success',
            'message'   => $responseMessage,
            'data' => [
                'successful_count' => count($successfulPurchases),
                'failed_count' => count($failedPurchases),
                'purchases' => $successfulPurchases,
                'failures'  => $failedPurchases,
            ]
        ]);
    }
}
