-- database/setup_mysql.sql
-- Run this file in MySQL to create the database and table

CREATE DATABASE IF NOT EXISTS taskmanager;
USE taskmanager;

CREATE TABLE IF NOT EXISTS tasks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  done       BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample initial tasks
INSERT INTO tasks (title) VALUES ('Learn React');
INSERT INTO tasks (title) VALUES ('Learn Node.js');
INSERT INTO tasks (title) VALUES ('Deploy on AWS EC2');
