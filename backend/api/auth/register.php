<?php
// POST /backend/api/auth/register.php
// Register a new user with validation
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('POST required', 405);

$data = getBody();
$name     = clean($data['name'] ?? '');
$email    = strtolower(trim($data['email'] ?? ''));
$phone    = clean($data['phone'] ?? '');
$password = (string)($data['password'] ?? '');
$address  = clean($data['address'] ?? '');
$city     = clean($data['city'] ?? 'Dhaka');

// Validate with descriptive user-friendly messages
$errors = [];
if (strlen($name) < 2) {
    $errors[] = 'Full name must be at least 2 characters.';
}
if (empty($email)) {
    $errors[] = 'Email address is required.';
} elseif (!isValidEmail($email)) {
    $errors[] = 'Please enter a valid email address (e.g. name@example.com).';
}
if (strlen($password) < 6) {
    $errors[] = 'Password must be at least 6 characters long.';
}
if (!empty($phone) && !isValidPhone($phone)) {
    $errors[] = 'Please enter a valid phone number (e.g. 01XXXXXXXXX).';
}

if (count($errors)) {
    sendError($errors[0], 422, $errors);
}

$db = getDB();

// Check duplicate email
$stmt = $db->prepare("SELECT id FROM users WHERE email = :e LIMIT 1");
$stmt->execute([':e' => $email]);
if ($stmt->fetch()) {
    sendError('This email is already registered. Please sign in instead.', 409);
}

// Check duplicate phone if provided
if (!empty($phone)) {
    $stmt = $db->prepare("SELECT id FROM users WHERE phone = :p LIMIT 1");
    $stmt->execute([':p' => $phone]);
    if ($stmt->fetch()) {
        sendError('This phone number is already registered with another account.', 409);
    }
}

// Insert user
$stmt = $db->prepare(
    "INSERT INTO users (name, email, phone, password, address, city)
     VALUES (:n, :e, :p, :pw, :a, :c)"
);
$stmt->execute([
    ':n'  => $name,
    ':e'  => $email,
    ':p'  => $phone ?: null,
    ':pw' => hashPassword($password),
    ':a'  => $address ?: null,
    ':c'  => $city,
]);
$userId = (int)$db->lastInsertId();

// Auto-login: create session
$token = createSession($db, $userId);

// Link any guest cart items from this session to the new user
$sessionId = clean($data['session_id'] ?? $_SERVER['HTTP_X_SESSION_ID'] ?? '');
if (!empty($sessionId)) {
    try {
        $stmtCartLink = $db->prepare("UPDATE cart_items SET user_id = :uid WHERE session_id = :sid AND user_id IS NULL");
        $stmtCartLink->execute([':uid' => $userId, ':sid' => $sessionId]);
    } catch (Exception $e) {}
}

sendResponse([
    'user'  => [
        'id' => $userId, 'name' => $name, 'email' => $email,
        'phone' => $phone ?: null, 'role' => 'user', 'city' => $city, 'address' => $address ?: null
    ],
    'token' => $token,
], 201, 'Registration successful!');
