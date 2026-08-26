<?php
// ==========================================================
// SOHAN TECH — JSON Response & Input Helpers
// ==========================================================

function sendResponse($data = null, int $code = 200, string $msg = '', bool $ok = true) {
    http_response_code($code);
    // date('c') produces ISO 8601 with timezone offset (e.g. +06:00) — matches device time
    $r = ['success' => $ok, 'message' => $msg, 'timestamp' => date('c')];
    if ($data !== null) $r['data'] = $data;
    echo json_encode($r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function sendError(string $msg, int $code = 400, $errors = null) {
    // If multiple errors were given and message is generic, use the first error for clarity
    if (is_array($errors) && !empty($errors) && ($msg === 'Validation failed' || empty($msg))) {
        $msg = $errors[0];
    }
    $d = $errors !== null ? ['errors' => is_array($errors) ? $errors : [$errors]] : null;
    sendResponse($d, $code, $msg, false);
}

function getBody(): array {
    $ct = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($ct, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        $d = json_decode($raw, true);
        return is_array($d) ? $d : [];
    }
    return array_merge($_GET, $_POST);
}

function clean($v): string {
    if (!is_string($v)) return '';
    return trim(strip_tags($v));
}

function isValidEmail(string $e): bool {
    $cleanEmail = trim($e);
    return filter_var($cleanEmail, FILTER_VALIDATE_EMAIL) !== false;
}

function isValidPhone(string $p): bool {
    $digits = preg_replace('/[^0-9]/', '', $p);
    return strlen($digits) >= 8 && strlen($digits) <= 15;
}

