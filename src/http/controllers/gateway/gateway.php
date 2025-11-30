<?php

function generateRandomString($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

function getCurrentTimestamp() {
    return gmdate("Y-m-d H:i:s");
}

function encryptBizContent($data, $privateKeyPem) {
    $jsonData = json_encode($data, JSON_UNESCAPED_UNICODE);
    $buffer = str_split($jsonData, 117);
    $encrypted = '';

    foreach ($buffer as $chunk) {
        openssl_private_encrypt($chunk, $encryptedChunk, $privateKeyPem, OPENSSL_PKCS1_PADDING);
        $encrypted .= $encryptedChunk;
    }

    return base64_encode($encrypted);
}

function generateSignature($params, $privateKeyPem) {
    ksort($params);
    $signString = '';

    foreach ($params as $key => $value) {
        if ($key !== 'sign' && $key !== 'sign_type') {
            $signString .= $key . '=' . urldecode($value) . '&';
        }
    }

    $signString = rtrim($signString, '&');
    openssl_sign($signString, $signature, $privateKeyPem, OPENSSL_ALGO_SHA1);
    return base64_encode($signature);
}

function createExpressPayment($props) {
    $total = $props['total'];

    $partnerId = 'id_do_parceiro_colar_aqui'; // partiner id (id do parceiro)

    $privateKey = <<<EOD
-----BEGIN PRIVATE KEY-----
colcar aqui a chave privada
-----END PRIVATE KEY-----
EOD;

    $bizContent = [
        "payer_ip" => "192.168.1.1",
        "timeout_express" => "10m",
        "sale_product_code" => "050200020",
        "cashier_type" => "SDK",
        "out_trade_no" => generateRandomString(24),
        "subject" => "Pagamento na Loja Virtual",
        "currency" => "AOA",
        "price" => (float)$total,
        "quantity" => 1,
        "total_amount" => (float)$total,
        "trade_info" => [
            "currency" => "AOA",
            "out_trade_no" => generateRandomString(24),
            "payee_identity" => $partnerId,
            "payee_identity_type" => "1",
            "price" => (float)$total,
            "quantity" => "1",
            "subject" => "Pagamento de produtos",
            "total_amount" => (float)$total,
        ],
      "pay_method" => [
    "pay_product_code" => "31",   // MCX
    "amount"           => (float)$total,
    "bank_code"        => "REF", // código específico do pagamento por referencia no express.
]

    ];

    $encryptedBizContent = encryptBizContent($bizContent, $privateKey);

    $requestBody = [
        "request_no" => generateRandomString(),
        "service" => "instant_trade",
        "version" => "1.0",
        "partner_id" => $partnerId,
        "charset" => "UTF-8",
        "language" => "pt",
        "sign_type" => "RSA",
        "timestamp" => getCurrentTimestamp(),
        "format" => "JSON",
        "biz_content" => urlencode($encryptedBizContent),
    ];

    $requestBody['sign'] = generateSignature($requestBody, $privateKey);

    $ch = curl_init("https://gateway.paypayafrica.com/recv.do");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}