<?php
// ==========================================================
// SOHAN TECH — Auth Token & Password Helpers
// ==========================================================

/**
 * Generate a secure random auth token
 */
function generateToken(int $length = 32): string {
    return bin2hex(random_bytes($length));
}

/**
 * Hash a password using bcrypt
 */
function hashPassword(string $password): string {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

/**
 * Verify a password against its hash
 */
function verifyPassword(string $password, string $hash): bool {
    return password_verify($password, $hash);
}

/**
 * Create a new session token in the database
 * Returns the token string
 */
function createSession(PDO $db, int $userId, int $expiryDays = 30): string {
    $token = generateToken();
    $expires = date('Y-m-d H:i:s', strtotime("+{$expiryDays} days"));
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';

    $stmt = $db->prepare(
        "INSERT INTO user_sessions (user_id, token, user_agent, ip_address, expires_at)
         VALUES (:uid, :token, :ua, :ip, :exp)"
    );
    $stmt->execute([
        ':uid'   => $userId,
        ':token' => $token,
        ':ua'    => substr($ua, 0, 500),
        ':ip'    => $ip,
        ':exp'   => $expires,
    ]);

    return $token;
}

/**
 * Validate a session token and return the user row (or null)
 */
function validateToken(PDO $db, ?string $token): ?array {
    if (!$token) return null;

    // Clean "Bearer " prefix
    if (str_starts_with($token, 'Bearer ')) {
        $token = substr($token, 7);
    }
    $token = trim($token);
    if (empty($token)) return null;

    $stmt = $db->prepare(
        "SELECT u.id, u.name, u.email, u.phone, u.role, u.avatar, u.address, u.city, u.created_at
         FROM user_sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token = :token AND s.expires_at > NOW()"
    );
    $stmt->execute([':token' => $token]);
    return $stmt->fetch() ?: null;
}

/**
 * Destroy a session token
 */
function destroySession(PDO $db, string $token): void {
    if (str_starts_with($token, 'Bearer ')) {
        $token = substr($token, 7);
    }
    $stmt = $db->prepare("DELETE FROM user_sessions WHERE token = :token");
    $stmt->execute([':token' => trim($token)]);
}

/**
 * Get Authorization header value across various server environments
 */
function getAuthHeader(): ?string {
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        return $_SERVER['HTTP_AUTHORIZATION'];
    }
    if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (!empty($headers['Authorization'])) return $headers['Authorization'];
        if (!empty($headers['authorization'])) return $headers['authorization'];
    }
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (!empty($headers['Authorization'])) return $headers['Authorization'];
        if (!empty($headers['authorization'])) return $headers['authorization'];
    }
    return null;
}

/**
 * Get the current authenticated user from the Authorization header, or null
 */
function getCurrentUser(PDO $db): ?array {
    $token = getAuthHeader();
    return validateToken($db, $token);
}

/**
 * Require authentication — sends 401 if not logged in
 */
function requireAuth(PDO $db): array {
    $user = getCurrentUser($db);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        exit;
    }
    return $user;
}
