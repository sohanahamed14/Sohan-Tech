<?php
// ==========================================================
// SOHAN TECH — PDO Database Connection (XAMPP)
// Host: localhost | User: root | Pass: "" | DB: Sohan_Tech_db
// Timezone: Asia/Dhaka (BDT +06:00) — matches device time
// ==========================================================

// Set PHP timezone to match device (Bangladesh)
date_default_timezone_set('Asia/Dhaka');

define('DB_HOST',    '127.0.0.1');
define('DB_PORT',    '3306');
define('DB_NAME',    'Sohan_Tech_db');
define('DB_USER',    'root');
define('DB_PASS',    '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Returns a singleton PDO instance
 */
function getDB(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
    );

    $opts = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $opts);
    } catch (PDOException $e) {
        $sockPath = '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock';
        if (file_exists($sockPath)) {
            try {
                $sockDsn = sprintf('mysql:unix_socket=%s;dbname=%s;charset=%s', $sockPath, DB_NAME, DB_CHARSET);
                $pdo = new PDO($sockDsn, DB_USER, DB_PASS, $opts);
            } catch (PDOException $sockErr) {}
        }
        if (!$pdo) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'DB connection failed: ' . $e->getMessage()]);
            exit;
        }
    }

    // Set MySQL session timezone to BDT (+06:00) so CURRENT_TIMESTAMP matches device time
    $pdo->exec("SET time_zone = '+06:00'");

    // Auto-create tables on first connect
    ensureTables($pdo);
    return $pdo;
}

/**
 * Run schema.sql if the users table doesn't exist yet
 */
function ensureTables(PDO $pdo): void {
    try {
        $r = $pdo->query("SHOW TABLES LIKE 'users'");
        if ($r->rowCount() === 0) {
            $sql = file_get_contents(__DIR__ . '/../schema.sql');
            if ($sql) $pdo->exec($sql);
        }
    } catch (Exception $e) {
        error_log('ensureTables: ' . $e->getMessage());
    }
}
