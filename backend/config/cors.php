<?php
// ==========================================================
// SOHAN TECH — CORS Headers
// ==========================================================

$allowedOrigins = [
    'http://localhost',
    'http://127.0.0.1',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'null' // file:// protocol sends origin 'null'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (empty($origin) || $origin === 'null') {
    // Allow file:// and no-origin requests (direct browser, XAMPP local)
    header("Access-Control-Allow-Origin: *");
} elseif (in_array($origin, $allowedOrigins) || preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Max-Age: 86400");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Session-Id");
header("Content-Type: application/json; charset=UTF-8");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

