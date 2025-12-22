const mysql = require('../db/connection');

const Fridge = {
  add: (data, callback) => {
    mysql.query('SELECT MAX(fridge_id) AS maxId FROM fridge', (err, results) => {
      if (err) return callback(err);
      const newId = (results[0].maxId || 0) + 1;
      const updatedAt = new Date();
      const sql = 'INSERT INTO fridge (fridge_id, user_id, ingredient_id, quantity, expiration_date, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
      mysql.query(sql, [newId, data.user_id, data.ingredient_id, data.quantity, data.expiration_date, updatedAt], callback);
    });
  },

  getAllByUser: (userId, callback) => {
    const sql = 'SELECT * FROM fridge WHERE user_id = ?';
    mysql.query(sql, [userId], callback);
  },

  updateQuantity: (id, quantity, callback) => {
    const updatedAt = new Date();
    const sql = 'UPDATE fridge SET quantity = ?, updated_at = ? WHERE fridge_id = ?';
    mysql.query(sql, [quantity, updatedAt, id], callback);
  },

  remove: (id, callback) => {
    const sql = 'DELETE FROM fridge WHERE fridge_id = ?';
    mysql.query(sql, [id], callback);
  }
};

module.exports = Fridge;
