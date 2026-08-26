<?php
// GET /backend/api/auth/me.php
// Returns the currently logged-in user's profile and stats
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$db = getDB();
$user = requireAuth($db);

// Fetch additional stats for this user
if (!empty($user['phone'])) {
    $stmtOrders = $db->prepare("SELECT COUNT(*) as total_orders, COALESCE(SUM(total), 0) as total_spent FROM orders WHERE user_id = :uid OR customer_phone = :phone");
    $stmtOrders->execute([':uid' => $user['id'], ':phone' => $user['phone']]);
} else {
    $stmtOrders = $db->prepare("SELECT COUNT(*) as total_orders, COALESCE(SUM(total), 0) as total_spent FROM orders WHERE user_id = :uid");
    $stmtOrders->execute([':uid' => $user['id']]);
}
$orderStats = $stmtOrders->fetch() ?: ['total_orders' => 0, 'total_spent' => 0];

$sessionId = clean($_GET['session_id'] ?? $_SERVER['HTTP_X_SESSION_ID'] ?? '');
if (!empty($sessionId)) {
    $stmtCart = $db->prepare("SELECT COALESCE(SUM(qty), 0) as cart_count FROM cart_items WHERE user_id = :uid OR session_id = :sid");
    $stmtCart->execute([':uid' => $user['id'], ':sid' => $sessionId]);
} else {
    $stmtCart = $db->prepare("SELECT COALESCE(SUM(qty), 0) as cart_count FROM cart_items WHERE user_id = :uid");
    $stmtCart->execute([':uid' => $user['id']]);
}
$cartStats = $stmtCart->fetch() ?: ['cart_count' => 0];

sendResponse([
    'user'  => $user,
    'stats' => [
        'total_orders' => (int)$orderStats['total_orders'],
        'total_spent'  => (float)$orderStats['total_spent'],
        'cart_count'   => (int)$cartStats['cart_count']
    ]
], 200, 'Profile loaded');
