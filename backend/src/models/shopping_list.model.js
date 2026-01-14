const mysql = require('../db/connection');

const ShoppingList = {
  create: (data, callback) => {
    const createdAt = new Date();
    mysql.query(
      'INSERT INTO shopping_lists (user_id, plan_id, name, created_at) VALUES (?, ?, ?, ?)',
      [data.user_id, data.plan_id ?? null, data.name ?? null, createdAt],
      (err, result) => {
        if (err && (err.code === 'ER_BAD_FIELD_ERROR' || /Unknown column/i.test(String(err.message)))) {
          // Backward-compatible fallback for older DB schema without `name` column.
          return mysql.query(
            'INSERT INTO shopping_lists (user_id, plan_id, created_at) VALUES (?, ?, ?)',
            [data.user_id, data.plan_id ?? null, createdAt],
            callback
          );
        }
        callback(err, result);
      }
    );
  },

  getByUser: (userId, callback) => {
    mysql.query('SELECT * FROM shopping_lists WHERE user_id = ?', [userId], callback);
  },

  remove: (listId, callback) => {
    // Need to delete items first (FK constraint).
    mysql.query('DELETE FROM shopping_items WHERE list_id = ?', [listId], (err) => {
      if (err) return callback(err);
      mysql.query('DELETE FROM shopping_lists WHERE list_id = ?', [listId], callback);
    });
  }
};

module.exports = ShoppingList;
