<?php
// POST /backend/api/auth/update_profile.php
// Update user profile info or change password
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('POST method required', 405);

$db = getDB();
$user = requireAuth($db);
$data = getBody();

$name     = clean($data['name'] ?? $user['name']);
$phone    = clean($data['phone'] ?? $user['phone'] ?? '');
$address  = clean($data['address'] ?? $user['address'] ?? '');
$city     = clean($data['city'] ?? $user['city'] ?? 'Dhaka');
$newPassword = $data['new_password'] ?? '';
$oldPassword = $data['old_password'] ?? '';

$errors = [];
if (strlen($name) < 2) $errors[] = 'Name must be at least 2 characters';
if ($phone && !isValidPhone($phone)) $errors[] = 'Invalid phone number';

// If changing password
if ($newPassword) {
    if (strlen($newPassword) < 6) $errors[] = 'New password must be at least 6 characters';
    
    // Check old password
    $stmtPass = $db->prepare("SELECT password FROM users WHERE id = :id");
    $stmtPass->execute([':id' => $user['id']]);
    $curr = $stmtPass->fetch();
    
    if (!$curr || !verifyPassword($oldPassword, $curr['password'])) {
        $errors[] = 'Current password is incorrect';
    }
}

if (count($errors)) sendError('Validation failed', 422, $errors);

// Check if phone number is taken by another user
if ($phone && $phone !== $user['phone']) {
    $stmtPhone = $db->prepare("SELECT id FROM users WHERE phone = :phone AND id != :id");
    $stmtPhone->execute([':phone' => $phone, ':id' => $user['id']]);
    if ($stmtPhone->fetch()) {
        sendError('This phone number is already used by another account', 409);
    }
}

// Perform update
if ($newPassword) {
    $stmt = $db->prepare(
        "UPDATE users SET name = :name, phone = :phone, address = :address, city = :city, password = :pw WHERE id = :id"
    );
    $stmt->execute([
        ':name' => $name,
        ':phone' => $phone ?: null,
        ':address' => $address ?: null,
        ':city' => $city,
        ':pw' => hashPassword($newPassword),
        ':id' => $user['id']
    ]);
} else {
    $stmt = $db->prepare(
        "UPDATE users SET name = :name, phone = :phone, address = :address, city = :city WHERE id = :id"
    );
    $stmt->execute([
        ':name' => $name,
        ':phone' => $phone ?: null,
        ':address' => $address ?: null,
        ':city' => $city,
        ':id' => $user['id']
    ]);
}

// Fetch refreshed user
$stmtRefreshed = $db->prepare("SELECT id, name, email, phone, role, avatar, address, city, created_at FROM users WHERE id = :id");
$stmtRefreshed->execute([':id' => $user['id']]);
$updatedUser = $stmtRefreshed->fetch();

sendResponse(['user' => $updatedUser], 200, 'Profile updated successfully!');
