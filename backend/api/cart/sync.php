<?php
// POST /backend/api/cart/sync.php
// Bulk syncs an array of cart items into the MySQL database
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('POST method required', 405);

$db = getDB();
$user = getCurrentUser($db);
$data = getBody();

$sessionId = clean($data['session_id'] ?? $_SERVER['HTTP_X_SESSION_ID'] ?? '');
$items     = $data['items'] ?? [];
$userId    = $user ? (int)$user['id'] : null;

if (empty($sessionId) && !$user) sendError('Session ID or Login required', 422);

$db->beginTransaction();
try {
    // Optionally clear existing session items if replace mode requested
    $replace = !empty($data['replace']);
    if ($replace) {
        $stmtDel = $db->prepare("DELETE FROM cart_items WHERE session_id = :sid OR (:uid IS NOT NULL AND user_id = :uid2)");
        $stmtDel->execute([':sid' => $sessionId, ':uid' => $userId, ':uid2' => $userId]);
    }

    $stmtUpsert = $db->prepare(
        "INSERT INTO cart_items (user_id, session_id, product_id, name, brand, price, old_price, qty, emoji, image_url, category)
         VALUES (:uid, :sid, :pid, :name, :brand, :price, :old_price, :qty, :emoji, :img, :cat)
         ON DUPLICATE KEY UPDATE 
            qty = VALUES(qty), 
            user_id = COALESCE(VALUES(user_id), user_id),
            price = VALUES(price),
            updated_at = NOW()"
    );

    $syncedCount = 0;
    foreach ($items as $it) {
        $pid = clean($it['id'] ?? $it['product_id'] ?? '');
        $name = clean($it['name'] ?? '');
        if (empty($pid) || empty($name)) continue;

        $price = (float)($it['price'] ?? 0);
        $oldPrice = isset($it['oldPrice']) && $it['oldPrice'] !== '' ? (float)$it['oldPrice'] : (isset($it['old_price']) ? (float)$it['old_price'] : null);
        $qty = max(1, (int)($it['qty'] ?? 1));
        $emoji = clean($it['emoji'] ?? '🛍️');
        $img = clean($it['img'] ?? $it['image_url'] ?? '');
        $cat = clean($it['category'] ?? 'general');
        $brand = clean($it['brand'] ?? '');

        $stmtUpsert->execute([
            ':uid'       => $userId,
            ':sid'       => $sessionId,
            ':pid'       => $pid,
            ':name'      => $name,
            ':brand'     => $brand,
            ':price'     => $price,
            ':old_price' => $oldPrice,
            ':qty'       => $qty,
            ':emoji'     => $emoji,
            ':img'       => $img ?: null,
            ':cat'       => $cat
        ]);
        $syncedCount++;
    }

    $db->commit();
    sendResponse(['synced_items' => $syncedCount], 200, "Successfully synced $syncedCount items to MySQL database");
} catch (Exception $e) {
    $db->rollBack();
    sendError('Cart sync failed: ' . $e->getMessage(), 500);
}
