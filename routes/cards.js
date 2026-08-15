const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

// GET /api/cards - Lấy tất cả thẻ bài
router.get('/', async (req, res) => {
  try {
    const cards = await Card.findAll();
    res.json(cards);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ error: 'Error fetching cards' });
  }
});

// GET /api/cards/:id - Lấy thẻ bài theo ID
router.get('/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (err) {
    console.error('Error fetching card:', err);
    res.status(500).json({ error: 'Error fetching card' });
  }
});

// GET /api/cards/search/:name - Tìm thẻ bài theo tên
router.get('/search/:name', async (req, res) => {
  try {
    const cards = await Card.findByName(req.params.name);
    res.json(cards);
  } catch (err) {
    console.error('Error searching cards:', err);
    res.status(500).json({ error: 'Error searching cards' });
  }
});

// POST /api/cards - Tạo thẻ bài mới
router.post('/', async (req, res) => {
  try {
    const result = await Card.create(req.body);
    res.status(201).json({ 
      id: result.insertId, 
      ...req.body 
    });
  } catch (err) {
    console.error('Error creating card:', err);
    res.status(500).json({ error: 'Error creating card' });
  }
});

// PUT /api/cards/:id - Cập nhật thẻ bài
router.put('/:id', async (req, res) => {
  try {
    await Card.update(req.params.id, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    console.error('Error updating card:', err);
    res.status(500).json({ error: 'Error updating card' });
  }
});

// DELETE /api/cards/:id - Xóa thẻ bài
router.delete('/:id', async (req, res) => {
  try {
    await Card.delete(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error('Error deleting card:', err);
    res.status(500).json({ error: 'Error deleting card' });
  }
});

module.exports = router;
