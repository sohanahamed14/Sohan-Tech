<?php
// GET /backend/api/orders/get.php
// Returns detailed single order by order_id from MySQL
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$orderId = clean($_GET['order_id'] ?? $_GET['id'] ?? '');
if (empty($orderId)) sendError('Order ID required', 422);

$db = getDB();
$stmt = $db->prepare("SELECT * FROM orders WHERE order_id = :oid LIMIT 1");
$stmt->execute([':oid' => $orderId]);
$ord = $stmt->fetch();

if (!$ord) sendError('Order not found', 404);

$stmtItems = $db->prepare("SELECT product_id, name, brand, price, old_price, qty, emoji, image_url, category FROM order_items WHERE order_id = :oid");
$stmtItems->execute([':oid' => $orderId]);
$items = $stmtItems->fetchAll();

$itemsFormatted = array_map(function($it) {
    return [
        'id'       => $it['product_id'],
        'name'     => $it['name'],
        'brand'    => $it['brand'],
        'price'    => (float)$it['price'],
        'oldPrice' => $it['old_price'] !== null ? (float)$it['old_price'] : null,
        'qty'      => (int)$it['qty'],
        'emoji'    => $it['emoji'],
        'img'      => $it['image_url'],
        'category' => $it['category']
    ];
}, $items);

$response = [
    'orderId'       => $ord['order_id'],
    'customer'      => [
        'name'    => $ord['customer_name'],
        'phone'   => $ord['customer_phone'],
        'email'   => $ord['customer_email'],
        'address' => $ord['customer_address'],
        'city'    => $ord['customer_city'],
        'note'    => $ord['customer_note']
    ],
    'items'         => $itemsFormatted,
    'subtotal'      => (float)$ord['subtotal'],
    'shipping'      => (float)$ord['shipping'],
    'savings'       => (float)$ord['savings'],
    'total'         => (float)$ord['total'],
    'paymentMethod' => $ord['payment_method'],
    'createdAt'     => $ord['created_at'],
    'updatedAt'     => $ord['updated_at']
];

sendResponse(['order' => $response], 200, 'Order found');
