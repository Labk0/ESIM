<?php

namespace App\Services;

use App\Exceptions\EsimApiException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EsimService
{
    protected $apiUrl;
    protected $apiToken;

    public function __construct()
    {
        $this->apiUrl =env('TAMAMLIYO_API_URL');
        $this->apiToken =env('TAMAMLIYO_API_TOKEN');
    }

    public function getAvailableCountries()
    {
        $cacheKey = 'esim_countries';

        return Cache::remember($cacheKey, 86400, function () {
            $response = Http::withHeaders(['token' => $this->apiToken])
                ->get($this->apiUrl . '/esim/countries');

            if ($response->failed()) {
                Log::error('Ülkeler alınamadı.', $response->json() ?? []);

                throw new EsimApiException(
                    'Ülkeler alınamadı.',
                    $response->status(),
                    $response->json() ?? []
                );
            }

            return $response->json()['data'] ?? [];
        });
    }

    public function getPlansByCountryCode($countryCode)
    {
        $cacheKey = 'esim_plans_' . $countryCode;

        return Cache::remember($cacheKey, 3600, function () use ($countryCode) {
            $response = Http::withHeaders(['token' => $this->apiToken])
                ->get($this->apiUrl . '/esim/coverages/' . $countryCode);

            if ($response->failed()) {
                Log::error('Paketler alınamadı.', ['country_code' => $countryCode, 'response' => $response->json()]);

                throw new EsimApiException(
                    'Paketler alınamadı.',
                    $response->status(),
                    $response->json() ?? []
                );
            }

            return $response->json()['coverages'] ?? [];
        });
    }

    /**
     * @throws EsimApiException
     * @throws ConnectionException
     */
    public function createPendingSale(array $data)
    {
        $response = Http::withHeaders(['token' => $this->apiToken])
            ->post($this->apiUrl . '/esim/create', $data);

        if ($response->failed()) {
            Log::error('eSIM rezervasyon işlemi başarısız oldu.', $response->json() ?? []);

            throw new EsimApiException(
                'eSIM rezervasyon işlemi başarısız.',
                $response->status(),
                $response->json() ?? []
            );
        }

        return $response->json();
    }
    public function confirmPayment(array $data)
    {
        $response = Http::withHeaders(['token' => $this->apiToken])
            ->post($this->apiUrl . '/esim/confirm', $data);

        if ($response->failed()) {
            Log::error('ID ' . ($data['id'] ?? 'N/A') . ' için onaylama başarısız.', $response->json() ?? []);

            throw new EsimApiException(
                'eSIM onaylama işlemi başarısız.',
                $response->status(),
                $response->json() ?? []
            );
        }

        return $response->json();
    }
}
