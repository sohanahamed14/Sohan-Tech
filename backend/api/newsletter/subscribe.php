<?php
// ==========================================================
// SOHAN TECH — Newsletter Subscription API
// POST /backend/api/newsletter/subscribe.php
// Body: { "email": "user@example.com", "source": "homepage_stay_in_the_loop" }
// ==========================================================

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed. Use POST.', 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$email = trim($input['email'] ?? '');
$source = trim($input['source'] ?? 'homepage_stay_in_the_loop');

if (empty($email)) {
    sendError('Please enter your email address.', 422, ['email' => 'Email is required']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError('Please enter a valid email address.', 422, ['email' => 'Invalid email format']);
}

try {
    $db = getDB();
    $ip = $_SERVER['REMOTE_ADDR'] ?? null;

    // Insert or reactivate subscriber
    $stmt = $db->prepare("
        INSERT INTO `newsletter_subscribers` (`email`, `ip_address`, `source`, `status`, `created_at`, `updated_at`)
        VALUES (:email, :ip, :source, 'active', NOW(), NOW())
        ON DUPLICATE KEY UPDATE
            `status` = 'active',
            `updated_at` = NOW()
    ");

    $stmt->execute([
        ':email'  => strtolower($email),
        ':ip'     => $ip,
        ':source' => $source
    ]);

    sendResponse([
        'email'      => strtolower($email),
        'status'     => 'subscribed',
        'created_at' => date('Y-m-d H:i:s')
    ], 200, '🎉 Thank you for subscribing! Check your inbox for exclusive deals.');

} catch (Exception $e) {
    sendError('Failed to save subscription: ' . $e->getMessage(), 500);
}
