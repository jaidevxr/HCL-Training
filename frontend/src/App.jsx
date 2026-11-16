// App.jsx — Complete, Beginner-Friendly CRUD Application
// CRUD = Create, Read, Update, Delete

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Backend server URL (update this to your EC2 IP when deploying to AWS)
const API_URL = 'http://localhost:5000';

function App() {
  // --- STATE VARIABLES ---
  // 1. tasks: the list of tasks from backend
  const [tasks, setTasks] = useState([]);
  
  // 2. newTask: text typed into the "Add Task" box
  const [newTask, setNewTask] = useState('');
  
  // 3. editingId: id of the task currently being edited (null if none)
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  
  // 4. message: feedback banner (e.g. "Task added!")
  const [message, setMessage] = useState('');

  // Fetch all tasks once when the page loads
  useEffect(() => {
    fetchTasks();
  }, []);

  // ============================================
  // [R]EAD — Fetch all tasks from backend
  // ============================================
  function fetchTasks() {
    axios.get(API_URL + '/tasks')
      .then(function(response) {
        setTasks(response.data);
      })
      .catch(function(error) {
        console.log('Error fetching tasks:', error);
        setMessage('Could not connect to backend. Is it running?');
      });
  }

  // ============================================
  // [C]REATE — Add a new task
  // ============================================
  function addTask() {
    if (newTask.trim() === '') {
      setMessage('Please enter a task title first!');
      return;
    }

    axios.post(API_URL + '/tasks', { title: newTask })
      .then(function() {
        setMessage('Task created successfully!');
        setNewTask('');   // clear input box
        fetchTasks();     // refresh task list
      })
      .catch(function(error) {
        console.log('Error adding task:', error);
        setMessage('Failed to create task.');
      });
  }

  // ============================================
  // [U]PDATE — Save edited task title
  // ============================================
  function saveEdit(id) {
    if (editingText.trim() === '') {
      setMessage('Task title cannot be empty!');
      return;
    }

    axios.put(API_URL + '/tasks/' + id, { title: editingText })
      .then(function() {
        setMessage('Task updated successfully!');
        setEditingId(null);
        setEditingText('');
        fetchTasks();
      })
      .catch(function(error) {
        console.log('Error updating task:', error);
        setMessage('Failed to update task.');
      });
  }

  // [U]PDATE — Toggle task completion (done / not done)
  function toggleDone(task) {
    const newStatus = task.done ? 0 : 1;

    axios.put(API_URL + '/tasks/' + task.id, { done: newStatus })
      .then(function() {
        fetchTasks();
      })
      .catch(function(error) {
        console.log('Error updating status:', error);
      });
  }

  // ============================================
  // [D]ELETE — Delete a task by id
  // ============================================
  function deleteTask(id) {
    axios.delete(API_URL + '/tasks/' + id)
      .then(function() {
        setMessage('Task deleted successfully!');
        fetchTasks();
      })
      .catch(function(error) {
        console.log('Error deleting task:', error);
        setMessage('Failed to delete task.');
      });
  }

  // ============================================
  // USER INTERFACE (JSX)
  // ============================================
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '0 20px' }}>
      
      <h1>📝 Task Manager (CRUD)</h1>
      <p style={{ color: '#666' }}>Simple React + Node.js + MySQL / PostgreSQL app</p>

      {/* Status banner */}
      {message && (
        <div style={{ background: '#e6fffa', border: '1px solid #38b2ac', padding: '8px 12px', borderRadius: '4px', marginBottom: '16px', color: '#234e52' }}>
          {message}
        </div>
      )}

      {/* [C]REATE: Add Task Form */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="What do you need to do?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addTask(); }}
          style={{ flex: 1, padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          onClick={addTask}
          style={{ padding: '10px 18px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Add Task
        </button>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '20px' }} />

      {/* [R]EAD: List of Tasks */}
      <h2>Tasks List ({tasks.length})</h2>

      {tasks.length === 0 ? (
        <p style={{ color: '#888' }}>No tasks found. Add one above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '6px',
                backgroundColor: '#f7fafc',
                border: '1px solid #e2e8f0'
              }}
            >
              {/* Checkbox to toggle done status */}
              <input
                type="checkbox"
                checked={Boolean(task.done)}
                onChange={() => toggleDone(task)}
                style={{ marginRight: '12px', cursor: 'pointer', width: '18px', height: '18px' }}
              />

              {/* Task title or Edit input */}
              {editingId === task.id ? (
                <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #3182ce' }}
                  />
                  <button
                    onClick={() => saveEdit(task.id)}
                    style={{ background: '#38a169', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{ background: '#718096', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <span
                  style={{
                    flex: 1,
                    textDecoration: task.done ? 'line-through' : 'none',
                    color: task.done ? '#a0aec0' : '#2d3748',
                    fontSize: '16px'
                  }}
                >
                  {task.title}
                </span>
              )}

              {/* Action Buttons: Edit and Delete */}
              {editingId !== task.id && (
                <div style={{ display: 'flex', gap: '6px', marginLeft: '12px' }}>
                  <button
                    onClick={() => {
                      setEditingId(task.id);
                      setEditingText(task.title);
                    }}
                    style={{ background: '#edf2f7', border: '1px solid #cbd5e0', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{ background: '#fed7d7', color: '#c53030', border: '1px solid #feb2b2', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default App;
