<?php
// ==========================================================
// SOHAN TECH — Install / Health Check
// GET /backend/install.php — Creates tables and reports status
// ==========================================================

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/helpers/response.php';

try {
    $db = getDB();

    // Check if tables exist first — only run schema if any are missing
    $expected = ['users', 'user_sessions', 'cart_items', 'orders', 'order_items', 'newsletter_subscribers'];
    $tables = [];
    $needsInstall = false;

    foreach ($expected as $t) {
        $r = $db->query("SHOW TABLES LIKE " . $db->quote($t));
        $exists = $r->rowCount() > 0;
        $tables[$t] = $exists ? '✅ exists' : '❌ missing';
        if (!$exists) $needsInstall = true;
    }

    // Only run schema.sql if any table is missing
    if ($needsInstall) {
        $sql = file_get_contents(__DIR__ . '/schema.sql');
        if ($sql) $db->exec($sql);
        // Re-check after install
        foreach ($expected as $t) {
            $r = $db->query("SHOW TABLES LIKE " . $db->quote($t));
            $tables[$t] = $r->rowCount() > 0 ? '✅ exists' : '❌ missing';
        }
    }

    // Count rows
    $counts = [];
    foreach ($expected as $t) {
        try {
            $r = $db->query("SELECT COUNT(*) as c FROM `$t`");
            $counts[$t] = $r->fetch()['c'];
        } catch (Exception $e) {
            $counts[$t] = 'error';
        }
    }

    sendResponse([
        'database' => DB_NAME,
        'host'     => DB_HOST,
        'tables'   => $tables,
        'row_counts' => $counts,
        'php_version' => phpversion(),
    ], 200, 'SOHAN TECH backend installed successfully!');

} catch (Exception $e) {
    sendError('Installation failed: ' . $e->getMessage(), 500);
}

