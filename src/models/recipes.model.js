const mysql = require('../db/connection');

const Recipe = {
  create: (data, callback) => {
    const createdAt = new Date();
    mysql.query(
      'INSERT INTO recipes (recipe_id, user_id, title, category, description, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [data.recipe_id, data.user_id, data.title, data.category, data.description, createdAt],
      callback
    );
  },

  getAll: (callback) => {
    mysql.query('SELECT * FROM recipes', callback);
  },

  getById: (id, callback) => {
    mysql.query('SELECT * FROM recipes WHERE recipe_id = ?', [id], callback);
  },

  update: (id, data, callback) => {
    mysql.query(
      'UPDATE recipes SET title = ?, category = ?, description = ? WHERE recipe_id = ?',
      [data.title, data.category, data.description, id],
      callback
    );
  },

  delete: (id, callback) => {
    mysql.query('DELETE FROM recipes WHERE recipe_id = ?', [id], callback);
  }
};

module.exports = Recipe;
