const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Lấy tất cả user
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// GET /api/users/:id - Lấy user theo ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Không gửi password về client
    delete user.password;
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// POST /api/users/login - Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Error during login' });
  }
});

// POST /api/users - Tạo user mới
router.post('/', async (req, res) => {
  try {
    const result = await User.create(req.body);
    res.status(201).json({ 
      id: result.insertId, 
      name: req.body.name,
      username: req.body.username,
      role: req.body.role || 'user'
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// PUT /api/users/:id - Cập nhật user
router.put('/:id', async (req, res) => {
  try {
    await User.update(req.params.id, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// DELETE /api/users/:id - Xóa user
router.delete('/:id', async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
