<?php
// GET /backend/api/auth/users.php
// Returns list of registered users in Sohan_Tech_db (supports search/filter)
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$db = getDB();

$q = clean($_GET['q'] ?? '');

$sql = "SELECT u.id, u.name, u.email, u.phone, u.role, u.city, u.address, u.created_at,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total), 0) as total_spent
        FROM users u
        LEFT JOIN orders o ON (o.user_id = u.id OR (o.customer_phone = u.phone AND u.phone IS NOT NULL AND u.phone != ''))";

$params = [];
if (!empty($q)) {
    $sql .= " WHERE u.name LIKE :q OR u.email LIKE :q OR u.phone LIKE :q OR u.city LIKE :q";
    $params[':q'] = "%$q%";
}

$sql .= " GROUP BY u.id ORDER BY u.created_at DESC";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$users = $stmt->fetchAll();

sendResponse([
    'users' => $users,
    'total' => count($users)
], 200, 'Users loaded successfully');
