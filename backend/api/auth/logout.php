<?php
// POST /backend/api/auth/logout.php
// Invalidate current user session
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if ($authHeader) {
    $db = getDB();
    destroySession($db, $authHeader);
}

sendResponse(null, 200, 'Logged out successfully');
