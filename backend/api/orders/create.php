<?php
// POST /backend/api/orders/create.php
// Place an order and store everything in MySQL orders & order_items tables
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('POST method required', 405);

$db = getDB();
$user = getCurrentUser($db);
$data = getBody();

$sessionId     = clean($data['session_id'] ?? $_SERVER['HTTP_X_SESSION_ID'] ?? '');
$customer      = $data['customer'] ?? [];
$custName      = clean($customer['name'] ?? $user['name'] ?? 'Customer');
$custPhone     = clean($customer['phone'] ?? $user['phone'] ?? '');
$custEmail     = clean($customer['email'] ?? $user['email'] ?? '');
$custAddress   = clean($customer['address'] ?? $user['address'] ?? '');
$custCity      = clean($customer['city'] ?? $user['city'] ?? 'Dhaka');
$custNote      = clean($customer['note'] ?? '');
$paymentMethod = clean($data['paymentMethod'] ?? $data['payment_method'] ?? 'cod');
$customOrderId = clean($data['orderId'] ?? $data['order_id'] ?? '');

$errors = [];
if (empty($custName))    $errors[] = 'Customer name is required';
if (empty($custPhone))   $errors[] = 'Phone number is required';
if (empty($custAddress)) $errors[] = 'Delivery address is required';
if (count($errors)) sendError('Validation failed', 422, $errors);

$userId = $user ? (int)$user['id'] : null;

// Items can come in the request or directly from the MySQL cart_items table
$items = $data['items'] ?? [];
if (empty($items)) {
    // Fetch from cart_items table
    $stmtCart = $db->prepare("SELECT * FROM cart_items WHERE session_id = :sid OR (:uid IS NOT NULL AND user_id = :uid2)");
    $stmtCart->execute([':sid' => $sessionId, ':uid' => $userId, ':uid2' => $userId]);
    $dbCart = $stmtCart->fetchAll();
    
    foreach ($dbCart as $row) {
        $items[] = [
            'id'       => $row['product_id'],
            'name'     => $row['name'],
            'brand'    => $row['brand'],
            'price'    => (float)$row['price'],
            'oldPrice' => $row['old_price'] !== null ? (float)$row['old_price'] : null,
            'qty'      => (int)$row['qty'],
            'emoji'    => $row['emoji'],
            'img'      => $row['image_url'],
            'category' => $row['category']
        ];
    }
}

if (empty($items)) sendError('Cart is empty. Cannot place an empty order.', 400);

// Calculate totals
$subtotal = 0;
$savings = 0;
foreach ($items as $it) {
    $price = (float)($it['price'] ?? 0);
    $oldPrice = isset($it['oldPrice']) && $it['oldPrice'] !== '' ? (float)$it['oldPrice'] : null;
    $qty = max(1, (int)($it['qty'] ?? 1));
    $subtotal += ($price * $qty);
    if ($oldPrice && $oldPrice > $price) {
        $savings += (($oldPrice - $price) * $qty);
    }
}
$shipping = $subtotal >= 5000 ? 0 : 99;
$total = $subtotal + $shipping;

// Generate or ensure unique Order ID
$datePart = date('Ymd');
if (empty($customOrderId)) {
    $stmtCount = $db->query("SELECT COUNT(*) as c FROM orders WHERE order_id LIKE 'ST-{$datePart}-%'");
    $cnt = ((int)$stmtCount->fetch()['c']) + 1;
    $customOrderId = sprintf('ST-%s-%03d', $datePart, $cnt);
} else {
    // If client supplied ID already exists, regenerate to avoid collision
    $stmtCheckOid = $db->prepare("SELECT id FROM orders WHERE order_id = :oid");
    $stmtCheckOid->execute([':oid' => $customOrderId]);
    if ($stmtCheckOid->fetch()) {
        $stmtCount = $db->query("SELECT COUNT(*) as c FROM orders WHERE order_id LIKE 'ST-{$datePart}-%'");
        $cnt = ((int)$stmtCount->fetch()['c']) + 1;
        $customOrderId = sprintf('ST-%s-%03d', $datePart, $cnt);
    }
}

$db->beginTransaction();
try {
    // Insert into orders table
    $stmtOrder = $db->prepare(
        "INSERT INTO orders 
         (order_id, user_id, customer_name, customer_phone, customer_email, customer_address, customer_city, customer_note, subtotal, shipping, savings, total, payment_method)
         VALUES (:oid, :uid, :name, :phone, :email, :addr, :city, :note, :sub, :ship, :sav, :tot, :pay)"
    );
    $stmtOrder->execute([
        ':oid'   => $customOrderId,
        ':uid'   => $userId,
        ':name'  => $custName,
        ':phone' => $custPhone,
        ':email' => $custEmail ?: null,
        ':addr'  => $custAddress,
        ':city'  => $custCity,
        ':note'  => $custNote ?: null,
        ':sub'   => $subtotal,
        ':ship'  => $shipping,
        ':sav'   => $savings,
        ':tot'   => $total,
        ':pay'   => $paymentMethod
    ]);

    // Insert order items
    $stmtItem = $db->prepare(
        "INSERT INTO order_items (order_id, product_id, name, brand, price, old_price, qty, emoji, image_url, category)
         VALUES (:oid, :pid, :name, :brand, :price, :old_price, :qty, :emoji, :img, :cat)"
    );

    foreach ($items as $it) {
        $stmtItem->execute([
            ':oid'       => $customOrderId,
            ':pid'       => clean($it['id'] ?? $it['product_id'] ?? ''),
            ':name'      => clean($it['name'] ?? ''),
            ':brand'     => clean($it['brand'] ?? ''),
            ':price'     => (float)($it['price'] ?? 0),
            ':old_price' => isset($it['oldPrice']) && $it['oldPrice'] !== '' ? (float)$it['oldPrice'] : null,
            ':qty'       => max(1, (int)($it['qty'] ?? 1)),
            ':emoji'     => clean($it['emoji'] ?? '🛍️'),
            ':img'       => clean($it['img'] ?? $it['image_url'] ?? '') ?: null,
            ':cat'       => clean($it['category'] ?? 'general')
        ]);
    }

    // Clear MySQL cart for this session/user
    $stmtClear = $db->prepare("DELETE FROM cart_items WHERE session_id = :sid OR (:uid IS NOT NULL AND user_id = :uid2)");
    $stmtClear->execute([':sid' => $sessionId, ':uid' => $userId, ':uid2' => $userId]);

    // If logged in and user address was blank, update user address
    if ($userId && empty($user['address'])) {
        $stmtUserUp = $db->prepare("UPDATE users SET address = :a, city = :c WHERE id = :id AND address IS NULL");
        $stmtUserUp->execute([':a' => $custAddress, ':c' => $custCity, ':id' => $userId]);
    }

    $db->commit();

    sendResponse([
        'orderId'       => $customOrderId,
        'customer'      => [
            'name'    => $custName,
            'phone'   => $custPhone,
            'email'   => $custEmail,
            'address' => $custAddress,
            'city'    => $custCity
        ],
        'items'         => $items,
        'subtotal'      => $subtotal,
        'shipping'      => $shipping,
        'savings'       => $savings,
        'total'         => $total,
        'paymentMethod' => $paymentMethod,
        'createdAt'     => date('c'),
        'updatedAt'     => date('c')
    ], 201, 'Order created and saved to MySQL database successfully!');
} catch (Exception $e) {
    $db->rollBack();
    sendError('Failed to place order in database: ' . $e->getMessage(), 500);
}
