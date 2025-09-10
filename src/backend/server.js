const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const auth = require('./middleware/authMiddleware'); // Import the auth middleware
const checkRole = require('./middleware/roleMiddleware'); // Import the new role middleware
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// User Signup Route
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // Check if user already exists
    const userExists = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (userExists) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Insert new user into the database
    const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email, hashedPassword, role || 'student');

    res.status(201).json({ msg: 'User registered successfully', userId: result.lastInsertRowid });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// User Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and sign JWT
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    };

    // The token expires in 1 hour
    jwt.sign(
      payload,
      'supersecretkey', // We're hardcoding this for simplicity as per your request
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Protected Route to test authentication
app.get('/api/auth', auth, (req, res) => {
  res.json({ user: req.user });
});

// ----- ADMIN ROUTES (Student CRUD) -----

// @route   GET /api/students
// @desc    Get all students (Admin Only)
app.get('/api/students', auth, checkRole('admin'), (req, res) => {
  try {
    const students = db.prepare('SELECT * FROM students').all();
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/students
// @desc    Add a new student (Admin Only)
app.post('/api/students', auth, checkRole('admin'), (req, res) => {
  const { name, email, course, enrollmentDate } = req.body;
  try {
    const result = db.prepare('INSERT INTO students (name, email, course, enrollmentDate) VALUES (?, ?, ?, ?)').run(name, email, course, enrollmentDate);
    res.status(201).json({ msg: 'Student added successfully', studentId: result.lastInsertRowid });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/students/:id
// @desc    Update a student (Admin Only)
app.put('/api/students/:id', auth, checkRole('admin'), (req, res) => {
  const { id } = req.params;
  const { name, email, course } = req.body;
  try {
    db.prepare('UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?').run(name, email, course, id);
    res.json({ msg: 'Student updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete a student (Admin Only)
app.delete('/api/students/:id', auth, checkRole('admin'), (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM students WHERE id = ?').run(id);
    res.json({ msg: 'Student deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ----- STUDENT ROUTES (Profile Management) -----

// @route   GET /api/me
// @desc    Get my own profile (Student Only)
app.get('/api/me', auth, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/me
// @desc    Update my own profile (Student Only)
app.put('/api/me', auth, (req, res) => {
  const { name, email, course } = req.body;
  try {
    // Update the user's details in the 'users' table
    db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(name, email, req.user.id);

    // Update the user's details in the 'students' table (if they exist there)
    db.prepare('UPDATE students SET name = ?, email = ?, course = ? WHERE userId = ?').run(name, email, course, req.user.id);

    res.json({ msg: 'Profile updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Basic test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});