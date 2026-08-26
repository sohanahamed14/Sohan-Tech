<?php
// POST /backend/api/auth/login.php
// Login with email/phone and password
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('POST method required', 405);

$data = getBody();
$identifier = trim($data['email'] ?? $data['identifier'] ?? '');
$password   = $data['password'] ?? '';

if (empty($identifier)) sendError('Email or Phone is required', 422);
if (empty($password))   sendError('Password is required', 422);

$db = getDB();

$cleanPhone = preg_replace('/[^0-9]/', '', $identifier);

// Find user by email or phone
$stmt = $db->prepare(
    "SELECT id, name, email, phone, password, role, avatar, address, city, created_at 
     FROM users 
     WHERE email = :id_email 
        OR (phone IS NOT NULL AND phone != '' AND (phone = :id_raw OR REPLACE(REPLACE(REPLACE(phone, '-', ''), ' ', ''), '+', '') = :id_clean)) 
     LIMIT 1"
);
$stmt->execute([
    ':id_email' => strtolower($identifier),
    ':id_raw'   => $identifier,
    ':id_clean' => $cleanPhone ?: '---'
]);
$user = $stmt->fetch();

if (!$user || !verifyPassword($password, $user['password'])) {
    sendError('Incorrect email/phone or password. Please try again.', 401);
}

// Generate session token
$token = createSession($db, (int)$user['id']);

// Link any guest cart items from this session to the user
$sessionId = clean($data['session_id'] ?? $_SERVER['HTTP_X_SESSION_ID'] ?? '');
if (!empty($sessionId)) {
    try {
        $stmtCartLink = $db->prepare("UPDATE cart_items SET user_id = :uid WHERE session_id = :sid AND user_id IS NULL");
        $stmtCartLink->execute([':uid' => (int)$user['id'], ':sid' => $sessionId]);
    } catch (Exception $e) {}
}

// Don't expose password hash
unset($user['password']);

sendResponse([
    'user'  => $user,
    'token' => $token
], 200, 'Login successful!');
