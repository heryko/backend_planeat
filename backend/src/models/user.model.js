const mysql = require('../db/connection');

const User = {
  create: (userData, callback) => {
    const sql = 'INSERT INTO users (username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)';
    const createdAt = new Date(); // automatyczna data utworzenia
    mysql.query(
      sql,
      [
        userData.username, 
        userData.email, 
        userData.password_hash, 
        userData.role || 'user', // domyślnie 'user', jeśli brak w JSON
        createdAt
      ],
      callback
    );
  },

  getByIdentifier: (identifier, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1';
    mysql.query(sql, [identifier, identifier], callback);
  },

  getByUsernameOrEmail: (username, email, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1';
    mysql.query(sql, [username, email], callback);
  },

  update: (userData, callback) => {
  const sql = 'UPDATE users SET username = ?, email = ? WHERE user_id = ?';
  mysql.query(sql, [userData.username, userData.email, userData.user_id], callback);
  },

  getAll: (callback) => {
    const sql = 'SELECT * FROM users';
    mysql.query(sql, callback);
  },

  getById: (userId, callback) => {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    mysql.query(sql, [userId], callback);
  },

  updatePassword: (userId, passwordHash, callback) => {
    const sql = 'UPDATE users SET password_hash = ? WHERE user_id = ?';
    mysql.query(sql, [passwordHash, userId], callback);
  },

  remove: (userId, callback) => {
    const sql = 'DELETE FROM users WHERE user_id = ?';
    mysql.query(sql, [userId], callback);
  }
};

module.exports = User;
