-- ==========================================================
-- SOHAN TECH — Full Database Schema
-- Database: Sohan_Tech_db  |  Engine: InnoDB
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `Sohan_Tech_db`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `Sohan_Tech_db`;

-- 1. USERS
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(100)  NOT NULL,
  `email`      VARCHAR(191)  NOT NULL UNIQUE,
  `phone`      VARCHAR(30)   NULL UNIQUE,
  `password`   VARCHAR(255)  NOT NULL,
  `role`       ENUM('user','admin') NOT NULL DEFAULT 'user',
  `avatar`     VARCHAR(255)  DEFAULT NULL,
  `address`    TEXT          DEFAULT NULL,
  `city`       VARCHAR(100)  DEFAULT 'Dhaka',
  `created_at` DATETIME      DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. AUTH TOKENS
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `user_id`    INT          NOT NULL,
  `token`      VARCHAR(255) NOT NULL UNIQUE,
  `user_agent` VARCHAR(500) NULL,
  `ip_address` VARCHAR(50)  NULL,
  `expires_at` DATETIME     NOT NULL,
  `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_sessions_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CART ITEMS
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `user_id`    INT          NULL,
  `session_id` VARCHAR(100) NOT NULL,
  `product_id` VARCHAR(100) NOT NULL,
  `name`       VARCHAR(255) NOT NULL,
  `brand`      VARCHAR(100) DEFAULT '',
  `price`      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `old_price`  DECIMAL(12,2) NULL,
  `qty`        INT          NOT NULL DEFAULT 1,
  `emoji`      VARCHAR(20)  DEFAULT '🛍️',
  `image_url`  VARCHAR(500) NULL,
  `category`   VARCHAR(100) DEFAULT 'general',
  `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_cart_session` (`session_id`),
  INDEX `idx_cart_user`    (`user_id`),
  UNIQUE KEY `unique_cart_product` (`session_id`, `product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS `orders` (
  `id`               INT AUTO_INCREMENT PRIMARY KEY,
  `order_id`         VARCHAR(50)   NOT NULL UNIQUE,
  `user_id`          INT           NULL,
  `customer_name`    VARCHAR(150)  NOT NULL,
  `customer_phone`   VARCHAR(30)   NOT NULL,
  `customer_email`   VARCHAR(191)  NULL,
  `customer_address` TEXT          NOT NULL,
  `customer_city`    VARCHAR(100)  DEFAULT 'Dhaka',
  `customer_note`    TEXT          NULL,
  `subtotal`         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `shipping`         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `savings`          DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total`            DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `payment_method`   VARCHAR(50)   NOT NULL DEFAULT 'cod',
  `created_at`       DATETIME      DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_orders_order_id` (`order_id`),
  INDEX `idx_orders_phone`    (`customer_phone`),
  INDEX `idx_orders_user`     (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ORDER ITEMS
CREATE TABLE IF NOT EXISTS `order_items` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `order_id`   VARCHAR(50)   NOT NULL,
  `product_id` VARCHAR(100)  NOT NULL,
  `name`       VARCHAR(255)  NOT NULL,
  `brand`      VARCHAR(100)  DEFAULT '',
  `price`      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `old_price`  DECIMAL(12,2) NULL,
  `qty`        INT           NOT NULL DEFAULT 1,
  `emoji`      VARCHAR(20)   DEFAULT '🛍️',
  `image_url`  VARCHAR(500)  NULL,
  `category`   VARCHAR(100)  DEFAULT 'general',
  `created_at` DATETIME      DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_oi_order` (`order_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. NEWSLETTER SUBSCRIBERS (Stay in the Loop Emails)
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `email`      VARCHAR(191) NOT NULL UNIQUE,
  `ip_address` VARCHAR(50)  NULL,
  `source`     VARCHAR(100) DEFAULT 'homepage_stay_in_the_loop',
  `status`     ENUM('active','unsubscribed') NOT NULL DEFAULT 'active',
  `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_subscribers_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

