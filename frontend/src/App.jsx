// App.jsx — This is the main React component
// It shows the Task Manager UI

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// The backend server address — change this to your EC2 IP when deploying
const API_URL = 'http://localhost:5000';

function App() {

  // tasks = list of tasks from the database
  const [tasks, setTasks] = useState([]);

  // newTask = whatever the user types in the input box
  const [newTask, setNewTask] = useState('');

  // message = small status message like "Task added!" or "Error!"
  const [message, setMessage] = useState('');

  // This runs once when the page loads — it fetches all tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  // --- Fetch all tasks from backend ---
  function fetchTasks() {
    axios.get(API_URL + '/tasks')
      .then(function(response) {
        // response.data is the list of tasks from the server
        setTasks(response.data);
      })
      .catch(function(error) {
        console.log('Error fetching tasks:', error);
        setMessage('Could not load tasks. Is the backend running?');
      });
  }

  // --- Add a new task ---
  function addTask() {
    // Don't add an empty task
    if (newTask.trim() === '') {
      setMessage('Please type something first!');
      return;
    }

    // Send the new task to the backend
    axios.post(API_URL + '/tasks', { title: newTask })
      .then(function(response) {
        setMessage('Task added!');
        setNewTask('');   // clear the input box
        fetchTasks();     // reload the task list
      })
      .catch(function(error) {
        console.log('Error adding task:', error);
        setMessage('Failed to add task.');
      });
  }

  // --- Delete a task ---
  function deleteTask(id) {
    // Send DELETE request to the backend with the task id
    axios.delete(API_URL + '/tasks/' + id)
      .then(function(response) {
        setMessage('Task deleted!');
        fetchTasks();   // reload the task list
      })
      .catch(function(error) {
        console.log('Error deleting task:', error);
        setMessage('Failed to delete task.');
      });
  }

  // --- What the user sees on screen ---
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial' }}>

      <h1>📝 My Task Manager</h1>

      {/* Show message if there is one */}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {/* Input box + Add button */}
      <div>
        <input
          type="text"
          placeholder="Type a new task..."
          value={newTask}
          onChange={function(e) { setNewTask(e.target.value); }}
          style={{ padding: '8px', width: '75%' }}
        />
        <button
          onClick={addTask}
          style={{ padding: '8px 16px', marginLeft: '8px', cursor: 'pointer' }}
        >
          Add Task
        </button>
      </div>

      <hr />

      {/* Show the list of tasks */}
      <h2>All Tasks</h2>

      {tasks.length === 0 && <p>No tasks yet. Add one above!</p>}

      {tasks.map(function(task) {
        return (
          <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span>{task.title}</span>
            <button
              onClick={function() { deleteTask(task.id); }}
              style={{ color: 'red', cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        );
      })}

    </div>
  );
}

export default App;
