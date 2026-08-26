<?php
// GET /backend/api/orders/list.php
// Returns orders from MySQL database
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$db = getDB();
$user = getCurrentUser($db);
$phone = clean($_GET['phone'] ?? '');
$idsParam = clean($_GET['ids'] ?? '');
$query = clean($_GET['q'] ?? '');

$sql = "SELECT id, order_id, user_id, customer_name, customer_phone, customer_email, customer_address, customer_city, customer_note, subtotal, shipping, savings, total, payment_method, created_at, updated_at 
        FROM orders";

$params = [];
$conditions = [];

// Specific order IDs requested
if (!empty($idsParam)) {
    $idList = array_filter(array_map('trim', explode(',', $idsParam)));
    if (!empty($idList)) {
        $placeholders = [];
        foreach ($idList as $i => $idVal) {
            $ph = ":oid_{$i}";
            $placeholders[] = $ph;
            $params[$ph] = $idVal;
        }
        $conditions[] = "order_id IN (" . implode(',', $placeholders) . ")";
    }
} elseif ($user) {
    if ($user['role'] === 'admin' && isset($_GET['all'])) {
        // Admin viewing all orders
    } else {
        $userPhone = !empty($user['phone']) ? $user['phone'] : $phone;
        if (!empty($userPhone)) {
            $cleanUserPhone = preg_replace('/[^0-9]/', '', $userPhone);
            $conditions[] = "(user_id = :uid OR customer_phone = :phone OR REPLACE(REPLACE(REPLACE(customer_phone, '-', ''), ' ', ''), '+', '') = :clean_phone)";
            $params[':uid']         = $user['id'];
            $params[':phone']       = $userPhone;
            $params[':clean_phone'] = $cleanUserPhone ?: '---';
        } else {
            $conditions[] = "user_id = :uid";
            $params[':uid'] = $user['id'];
        }
    }
} elseif (!empty($phone)) {
    $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
    $conditions[] = "(customer_phone = :phone OR REPLACE(REPLACE(REPLACE(customer_phone, '-', ''), ' ', ''), '+', '') = :clean_phone)";
    $params[':phone']       = $phone;
    $params[':clean_phone'] = $cleanPhone ?: '---';
} else {
    // If guest with no phone or ids specified, return recent orders if all requested, otherwise return empty
    if (!isset($_GET['all'])) {
        $conditions[] = "1 = 0";
    }
}

if (!empty($query)) {
    $conditions[] = "(order_id LIKE :q OR customer_name LIKE :q OR customer_phone LIKE :q)";
    $params[':q'] = "%{$query}%";
}

if (!empty($conditions)) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}

$sql .= " ORDER BY id DESC LIMIT 100";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();

// Fetch items for each order
$result = [];
foreach ($orders as $ord) {
    $stmtItems = $db->prepare("SELECT product_id, name, brand, price, old_price, qty, emoji, image_url, category FROM order_items WHERE order_id = :oid");
    $stmtItems->execute([':oid' => $ord['order_id']]);
    $items = $stmtItems->fetchAll();

    $formattedItems = array_map(function($it) {
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

    $result[] = [
        'orderId'       => $ord['order_id'],
        'customer'      => [
            'name'    => $ord['customer_name'],
            'phone'   => $ord['customer_phone'],
            'email'   => $ord['customer_email'],
            'address' => $ord['customer_address'],
            'city'    => $ord['customer_city'],
            'note'    => $ord['customer_note']
        ],
        'items'         => $formattedItems,
        'subtotal'      => (float)$ord['subtotal'],
        'shipping'      => (float)$ord['shipping'],
        'savings'       => (float)$ord['savings'],
        'total'         => (float)$ord['total'],
        'paymentMethod' => $ord['payment_method'],
        // Convert MySQL DATETIME to ISO 8601 with timezone offset (e.g. 2026-08-22T21:55:00+06:00)
        'createdAt'     => date('c', strtotime($ord['created_at'])),
        'updatedAt'     => date('c', strtotime($ord['updated_at']))
    ];
}

sendResponse(['orders' => $result, 'count' => count($result)], 200, 'Orders loaded');

