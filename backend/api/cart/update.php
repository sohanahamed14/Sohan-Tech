<?php
// POST /backend/api/cart/update.php
// Update item quantity in MySQL cart (or remove if qty <= 0)
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
$qty       = (int)($data['qty'] ?? 1);
$userId    = $user ? (int)$user['id'] : null;

if (empty($productId)) sendError('Product ID required', 422);

if ($qty <= 0) {
    // Delete item
    $stmt = $db->prepare("DELETE FROM cart_items WHERE product_id = :pid AND (session_id = :sid OR (:uid IS NOT NULL AND user_id = :uid2))");
    $stmt->execute([':pid' => $productId, ':sid' => $sessionId, ':uid' => $userId, ':uid2' => $userId]);
    sendResponse(['product_id' => $productId, 'qty' => 0], 200, 'Item removed from cart');
} else {
    // Update qty
    $stmt = $db->prepare("UPDATE cart_items SET qty = :qty, updated_at = NOW() WHERE product_id = :pid AND (session_id = :sid OR (:uid IS NOT NULL AND user_id = :uid2))");
    $stmt->execute([':qty' => $qty, ':pid' => $productId, ':sid' => $sessionId, ':uid' => $userId, ':uid2' => $userId]);
    sendResponse(['product_id' => $productId, 'qty' => $qty], 200, 'Cart quantity updated in database');
}
