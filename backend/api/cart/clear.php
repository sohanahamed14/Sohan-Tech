<?php
// POST /backend/api/cart/clear.php
// Clear all items in cart for session or user
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('POST method required', 405);

$db = getDB();
$user = getCurrentUser($db);
$data = getBody();

$sessionId = clean($data['session_id'] ?? $_SERVER['HTTP_X_SESSION_ID'] ?? '');
$userId    = $user ? (int)$user['id'] : null;

$stmt = $db->prepare("DELETE FROM cart_items WHERE session_id = :sid OR (:uid IS NOT NULL AND user_id = :uid2)");
$stmt->execute([':sid' => $sessionId, ':uid' => $userId, ':uid2' => $userId]);

sendResponse(null, 200, 'Database cart cleared successfully');
