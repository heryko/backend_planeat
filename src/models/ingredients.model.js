const mysql = require('../db/connection');

const Ingredient = {
  create: (data, callback) => {
    const sql = 'INSERT INTO ingredients (ingredient_id, name, unit, capacity) VALUES (?, ?, ?, ?)';
    mysql.query(sql, [data.ingredient_id, data.name, data.unit, data.capacity], callback);
  },

  getAll: (callback) => {
    mysql.query('SELECT * FROM ingredients', callback);
  },

  getById: (id, callback) => {
    mysql.query('SELECT * FROM ingredients WHERE ingredient_id = ?', [id], callback);
  }
};

module.exports = Ingredient;
