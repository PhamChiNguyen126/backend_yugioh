const { executeQuery } = require('../database/connection');

class Card {
  // Lấy tất cả thẻ bài
  static async findAll() {
    const query = 'SELECT * FROM cards';
    return await executeQuery(query);
  }

  // Lấy thẻ bài theo ID
  static async findById(id) {
    const query = 'SELECT * FROM cards WHERE id = ?';
    const results = await executeQuery(query, [id]);
    return results[0] || null;
  }

  // Tìm thẻ bài theo tên
  static async findByName(name) {
    const query = 'SELECT * FROM cards WHERE name LIKE ?';
    return await executeQuery(query, [`%${name}%`]);
  }

  // Tạo thẻ bài mới
  static async create(cardData) {
    const { name, type, attribute, level, attack, defense, description, rarity, price, image_url } = cardData;
    const query = `INSERT INTO cards (name, type, attribute, level, attack, defense, description, rarity, price, image_url, created_at) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
    const params = [name, type, attribute, level, attack, defense, description, rarity, price, image_url];
    return await executeQuery(query, params);
  }

  // Cập nhật thẻ bài
  static async update(id, cardData) {
    const { name, type, attribute, level, attack, defense, description, rarity, price, image_url } = cardData;
    const query = `UPDATE cards SET name = ?, type = ?, attribute = ?, level = ?, attack = ?, defense = ?, 
                   description = ?, rarity = ?, price = ?, image_url = ?, updated_at = NOW() WHERE id = ?`;
    const params = [name, type, attribute, level, attack, defense, description, rarity, price, image_url, id];
    return await executeQuery(query, params);
  }

  // Xóa thẻ bài
  static async delete(id) {
    const query = 'DELETE FROM cards WHERE id = ?';
    return await executeQuery(query, [id]);
  }

  // Tìm thẻ bài theo loại/type
  static async findByType(type) {
    const query = 'SELECT * FROM cards WHERE type = ?';
    return await executeQuery(query, [type]);
  }

  // Tìm thẻ bài theo hiếm (rarity)
  static async findByRarity(rarity) {
    const query = 'SELECT * FROM cards WHERE rarity = ?';
    return await executeQuery(query, [rarity]);
  }
}

module.exports = Card;
