const { executeQuery } = require('../database/connection');

class User {
  // Lấy tất cả user
  static async findAll() {
    const query = 'SELECT id, name, username, role, created_at FROM users';
    return await executeQuery(query);
  }

  // Lấy user theo ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const results = await executeQuery(query, [id]);
    return results[0] || null;
  }

  // Lấy user theo username (để login)
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const results = await executeQuery(query, [username]);
    return results[0] || null;
  }

  // Tạo user mới
  static async create(userData) {
    const { name, username, password, role } = userData;
    const query = `INSERT INTO users (name, username, password, role, created_at) 
                   VALUES (?, ?, ?, ?, NOW())`;
    const params = [name, username, password, role || 'user'];
    return await executeQuery(query, params);
  }

  // Cập nhật user
  static async update(id, userData) {
    const { name, role } = userData;
    const query = `UPDATE users SET name = ?, role = ?, updated_at = NOW() WHERE id = ?`;
    const params = [name, role, id];
    return await executeQuery(query, params);
  }

  // Cập nhật password
  static async updatePassword(id, newPassword) {
    const query = `UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?`;
    const params = [newPassword, id];
    return await executeQuery(query, params);
  }

  // Xóa user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    return await executeQuery(query, [id]);
  }

  // Kiểm tra đăng nhập
  static async authenticate(username, password) {
    const query = 'SELECT id, name, username, role FROM users WHERE username = ? AND password = ?';
    const results = await executeQuery(query, [username, password]);
    return results[0] || null;
  }
}

module.exports = User;
