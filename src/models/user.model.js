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

  update: (userData, callback) => {
  const sql = 'UPDATE users SET username = ?, email = ? WHERE user_id = ?';
  mysql.query(sql, [userData.username, userData.email, userData.user_id], callback);
  },

  getAll: (callback) => {
    const sql = 'SELECT * FROM users';
    mysql.query(sql, callback);
  }
};

module.exports = User;
