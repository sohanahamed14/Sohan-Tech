<?php
// GET /backend/api/cart/get.php
// Get all items in cart for current user or session
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$db = getDB();
$user = getCurrentUser($db);
$sessionId = clean($_GET['session_id'] ?? $_SERVER['HTTP_X_SESSION_ID'] ?? '');

if (empty($sessionId) && !$user) {
    sendResponse(['items' => [], 'subtotal' => 0, 'savings' => 0, 'shipping' => 0, 'total' => 0, 'count' => 0]);
}

if ($user) {
    $stmt = $db->prepare(
        "SELECT id, product_id, name, brand, price, old_price, qty, emoji, image_url, category, created_at, updated_at 
         FROM cart_items 
         WHERE user_id = :uid OR session_id = :sid 
         ORDER BY id ASC"
    );
    $stmt->execute([':uid' => $user['id'], ':sid' => $sessionId]);
} else {
    $stmt = $db->prepare(
        "SELECT id, product_id, name, brand, price, old_price, qty, emoji, image_url, category, created_at, updated_at 
         FROM cart_items 
         WHERE session_id = :sid 
         ORDER BY id ASC"
    );
    $stmt->execute([':sid' => $sessionId]);
}

$rawItems = $stmt->fetchAll();

$items = [];
$subtotal = 0;
$savings = 0;
$count = 0;

foreach ($rawItems as $row) {
    $price = (float)$row['price'];
    $oldPrice = $row['old_price'] !== null ? (float)$row['old_price'] : null;
    $qty = (int)$row['qty'];
    
    $itemSubtotal = $price * $qty;
    $subtotal += $itemSubtotal;
    if ($oldPrice && $oldPrice > $price) {
        $savings += ($oldPrice - $price) * $qty;
    }
    $count += $qty;

    $items[] = [
        'id'        => $row['product_id'],
        'cart_id'   => (int)$row['id'],
        'name'      => $row['name'],
        'brand'     => $row['brand'],
        'price'     => $price,
        'oldPrice'  => $oldPrice,
        'qty'       => $qty,
        'emoji'     => $row['emoji'],
        'img'       => $row['image_url'],
        'category'  => $row['category']
    ];
}

$shipping = $subtotal >= 5000 || $count === 0 ? 0 : 99;
$total = $subtotal + $shipping;

sendResponse([
    'items'    => $items,
    'subtotal' => $subtotal,
    'savings'  => $savings,
    'shipping' => $shipping,
    'total'    => $total,
    'count'    => $count
], 200, 'Cart loaded');
