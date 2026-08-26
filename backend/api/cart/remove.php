<?php
// POST /backend/api/cart/remove.php
// Remove an item from the MySQL cart
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('POST method required', 405);

$db = getDB();
$user = getCurrentUser($db);
$data = getBody();

$sessionId = clean($data['session_id'] ?? $_SERVER['HTTP_X_SESSION_ID'] ?? '');
$productId = clean($data['product_id'] ?? $data['id'] ?? '');
$userId    = $user ? (int)$user['id'] : null;

if (empty($productId)) sendError('Product ID required', 422);

$stmt = $db->prepare("DELETE FROM cart_items WHERE product_id = :pid AND (session_id = :sid OR (:uid IS NOT NULL AND user_id = :uid2))");
$stmt->execute([':pid' => $productId, ':sid' => $sessionId, ':uid' => $userId, ':uid2' => $userId]);

sendResponse(['product_id' => $productId], 200, 'Item removed from database cart');
