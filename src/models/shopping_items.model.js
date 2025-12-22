const mysql = require('../db/connection');

const ShoppingItem = {
  add: (data, callback) => {
    const sql = 'INSERT INTO shopping_items (list_id, ingredient_id, quantity) VALUES (?, ?, ?)';
    mysql.query(sql, [data.list_id, data.ingredient_id, data.quantity], callback);
  },

  getByList: (listId, callback) => {
    mysql.query('SELECT * FROM shopping_items WHERE list_id = ?', [listId], callback);
  }
};

module.exports = ShoppingItem;
