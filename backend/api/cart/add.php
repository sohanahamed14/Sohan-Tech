<?php
// POST /backend/api/cart/add.php
// Add an item or increment quantity in MySQL database cart
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('POST method required', 405);

$db = getDB();
$user = getCurrentUser($db);
$data = getBody();

$sessionId  = clean($data['session_id'] ?? $_SERVER['HTTP_X_SESSION_ID'] ?? '');
$productId  = clean($data['product_id'] ?? $data['id'] ?? '');
$name       = clean($data['name'] ?? '');
$brand      = clean($data['brand'] ?? '');
$price      = (float)($data['price'] ?? 0);
$oldPrice   = isset($data['oldPrice']) && $data['oldPrice'] !== '' ? (float)$data['oldPrice'] : (isset($data['old_price']) ? (float)$data['old_price'] : null);
$qty        = max(1, (int)($data['qty'] ?? 1));
$emoji      = clean($data['emoji'] ?? '🛍️');
$imageUrl   = clean($data['img'] ?? $data['image_url'] ?? '');
$category   = clean($data['category'] ?? 'general');

if (empty($sessionId) && !$user) sendError('Session ID or Login required', 422);
if (empty($productId) || empty($name)) sendError('Product ID and Name are required', 422);

$userId = $user ? (int)$user['id'] : null;

// Check if already in cart
$stmtCheck = $db->prepare(
    "SELECT id, qty FROM cart_items 
     WHERE (session_id = :sid OR (:uid IS NOT NULL AND user_id = :uid2)) AND product_id = :pid 
     LIMIT 1"
);
$stmtCheck->execute([
    ':sid'  => $sessionId,
    ':uid'  => $userId,
    ':uid2' => $userId,
    ':pid'  => $productId
]);
$existing = $stmtCheck->fetch();

if ($existing) {
    // Increment qty
    $newQty = (int)$existing['qty'] + $qty;
    $stmtUp = $db->prepare("UPDATE cart_items SET qty = :qty, user_id = COALESCE(:uid, user_id), updated_at = NOW() WHERE id = :id");
    $stmtUp->execute([':qty' => $newQty, ':uid' => $userId, ':id' => $existing['id']]);
} else {
    // Insert new item
    $stmtIns = $db->prepare(
        "INSERT INTO cart_items (user_id, session_id, product_id, name, brand, price, old_price, qty, emoji, image_url, category)
         VALUES (:uid, :sid, :pid, :name, :brand, :price, :old_price, :qty, :emoji, :img, :cat)"
    );
    $stmtIns->execute([
        ':uid'       => $userId,
        ':sid'       => $sessionId,
        ':pid'       => $productId,
        ':name'      => $name,
        ':brand'     => $brand,
        ':price'     => $price,
        ':old_price' => $oldPrice,
        ':qty'       => $qty,
        ':emoji'     => $emoji,
        ':img'       => $imageUrl ?: null,
        ':cat'       => $category
    ]);
}

sendResponse(['product_id' => $productId, 'added_qty' => $qty], 200, 'Item added to cart in MySQL database');
