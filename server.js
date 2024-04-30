const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 9000;

// Middleware to parse JSON requests
app.use(express.json());

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud task'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Get all tasks
app.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error,cant fetch tasks:', err);
      res.status(500).json({ error: 'Oh No,Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body;
  const sql = 'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)';
  connection.query(sql, [title, description, status], (err, result) => {
    if (err) {
      console.error('Error creating task:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.status(201).json({ id: result.insertId, title, description, status });
  });
});


// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  connection.query(sql, taskId, (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(204).end();
  });
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { title, description, status } = req.body;
  const sql = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?';
  connection.query(sql, [title, description, status, taskId], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ id: taskId, title, description, status });
  });
});


//here Start the server
app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
