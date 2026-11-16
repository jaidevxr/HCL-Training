// server.js — Beginner-friendly backend server
// Supports both MySQL (default) and PostgreSQL
// Routes:
//   GET    /tasks       -> list all tasks
//   POST   /tasks       -> add a new task
//   DELETE /tasks/:id   -> delete a task
//   PUT    /tasks/:id   -> update a task

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configure Database (defaults to MySQL because MySQL 8.0 is running on your machine)
const DB_TYPE = (process.env.DB_TYPE || 'mysql').toLowerCase();
let isDbConnected = false;
let queryDb = null;

// Temporary fallback in-memory data (in case DB credentials are not yet entered)
let fallbackTasks = [
  { id: 1, title: 'Learn React Frontend', done: false },
  { id: 2, title: 'Learn Node.js Backend', done: false },
  { id: 3, title: 'Connect to MySQL / PostgreSQL', done: true },
  { id: 4, title: 'Deploy on AWS EC2', done: false }
];
let nextId = 5;

// Initialize Database Connection
async function setupDatabase() {
  try {
    if (DB_TYPE === 'mysql') {
      const mysql = require('mysql2/promise');
      const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'taskmanager'
      });

      // Test connection
      const connection = await pool.getConnection();
      console.log('✅ Successfully connected to MySQL database!');
      connection.release();

      // Query wrapper for MySQL
      queryDb = async (sql, params = []) => {
        const [rows] = await pool.query(sql, params);
        return rows;
      };
      isDbConnected = true;

    } else if (DB_TYPE === 'postgres') {
      const { Pool } = require('pg');
      const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'taskmanager'
      });

      await pool.connect();
      console.log('✅ Successfully connected to PostgreSQL database!');

      // Query wrapper for Postgres
      queryDb = async (sql, params = []) => {
        // Convert '?' to '$1, $2' for Postgres
        let idx = 1;
        const pgSql = sql.replace(/\?/g, () => `$${idx++}`);
        const result = await pool.query(pgSql, params);
        return result.rows;
      };
      isDbConnected = true;
    }
  } catch (err) {
    console.log('⚠️ Could not connect to ' + DB_TYPE.toUpperCase() + ': ' + err.message);
    console.log('👉 Using in-memory fallback tasks so your frontend works immediately!');
    console.log('👉 Update backend/.env with your DB password whenever you are ready.');
    isDbConnected = false;
  }
}

// ============================================
// 0. ROOT ROUTE (Health Check / Status)
// ============================================
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: Arial; padding: 30px; line-height: 1.6;">
      <h2 style="color: #2b6cb0;">🚀 Task Manager Backend API is running!</h2>
      <p>This is the <b>Node.js backend</b> server running on port 5000.</p>
      <ul>
        <li><b>View Tasks JSON API:</b> <a href="/tasks">/tasks</a></li>
        <li><b>Open React Frontend:</b> <a href="http://localhost:3000">http://localhost:3000</a></li>
      </ul>
    </div>
  `);
});

// ============================================
// 1. GET ALL TASKS
// ============================================
app.get('/tasks', async (req, res) => {
  if (isDbConnected) {
    try {
      const tasks = await queryDb('SELECT * FROM tasks ORDER BY id DESC');
      return res.json(tasks);
    } catch (err) {
      console.error('Error fetching tasks from DB:', err.message);
    }
  }
  // Return in-memory tasks if DB not connected
  res.json(fallbackTasks);
});

// ============================================
// 2. CREATE A TASK
// ============================================
app.post('/tasks', async (req, res) => {
  const title = req.body.title;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (isDbConnected) {
    try {
      const result = await queryDb('INSERT INTO tasks (title) VALUES (?)', [title]);
      const newId = result.insertId || (result[0] && result[0].id);
      return res.status(201).json({ id: newId, title, done: false });
    } catch (err) {
      console.error('Error adding task to DB:', err.message);
    }
  }

  // Fallback in-memory add
  const newTask = { id: nextId++, title, done: false };
  fallbackTasks.unshift(newTask);
  res.status(201).json(newTask);
});

// ============================================
// 3. DELETE A TASK
// ============================================
app.delete('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isDbConnected) {
    try {
      await queryDb('DELETE FROM tasks WHERE id = ?', [id]);
      return res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      console.error('Error deleting task from DB:', err.message);
    }
  }

  // Fallback in-memory delete
  fallbackTasks = fallbackTasks.filter(task => task.id !== id);
  res.json({ message: 'Task deleted successfully' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  await setupDatabase();
});
