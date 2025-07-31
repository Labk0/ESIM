<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EsimApiException extends Exception
{
    /**
     * @var array
     */
    public array $errorData;

    /**
     * @param string $message
     * @param int $code
     * @param array $errorData
     */
    public function __construct(string $message = "", int $code = 0, array $errorData = [])
    {
        parent::__construct($message, $code);

        $this->errorData = $errorData;
    }

    /**
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function render(Request $request)
    {
        return response()->json([
            'status' => 'error',
            'message' => $this->getMessage(),
            'provider_error' => $this->errorData
        ], $this->getCode() ?: 500);
    }
}
