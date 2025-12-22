const mysql = require('../db/connection');

const ShoppingList = {
  create: (data, callback) => {
    const createdAt = new Date();

    mysql.query('SELECT MAX(list_id) AS maxId FROM shopping_lists', (err, results) => {
      if (err) return callback(err);

      const nextId = results[0].maxId ? results[0].maxId + 1 : 1;

      mysql.query(
        'INSERT INTO shopping_lists (list_id, user_id, plan_id, created_at) VALUES (?, ?, ?, ?)',
        [nextId, data.user_id, data.plan_id, createdAt],
        callback
      );
    });
  },

  getByUser: (userId, callback) => {
    mysql.query('SELECT * FROM shopping_lists WHERE user_id = ?', [userId], callback);
  }
};

module.exports = ShoppingList;
