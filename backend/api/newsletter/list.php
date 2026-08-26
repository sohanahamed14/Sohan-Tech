<?php
// ==========================================================
// SOHAN TECH — Newsletter Subscribers List API (Admin)
// GET /backend/api/newsletter/list.php
// ==========================================================

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed. Use GET.', 405);
}

try {
    $db = getDB();

    $stmt = $db->query("
        SELECT `id`, `email`, `source`, `status`, `created_at`, `updated_at`
        FROM `newsletter_subscribers`
        ORDER BY `created_at` DESC
    ");
    $subscribers = $stmt->fetchAll();

    sendResponse([
        'subscribers' => $subscribers,
        'count'       => count($subscribers)
    ], 200, 'Newsletter subscribers fetched successfully');

} catch (Exception $e) {
    sendError('Failed to fetch subscribers: ' . $e->getMessage(), 500);
}
