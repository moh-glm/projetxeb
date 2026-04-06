-- Perfume Products Catalog Database Schema

CREATE DATABASE IF NOT EXISTS perfume_catalog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE perfume_catalog;

CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT         NOT NULL,
  price       DECIMAL(10, 2) NOT NULL,
  image_url   VARCHAR(500) DEFAULT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
