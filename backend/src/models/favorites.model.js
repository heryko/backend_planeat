const mysql = require('../db/connection');

const Favorite = {
  exists: (userId, recipeId, callback) => {
    const sql = 'SELECT 1 AS ok FROM favorites WHERE user_id = ? AND recipe_id = ? LIMIT 1';
    mysql.query(sql, [userId, recipeId], (err, rows) => {
      if (err) return callback(err);
      callback(null, Array.isArray(rows) && rows.length > 0);
    });
  },

  add: (data, callback) => {
    const sql = 'INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)';
    mysql.query(sql, [data.user_id, data.recipe_id], callback);
  },

  getAllByUser: (userId, callback) => {
    const sql = 'SELECT * FROM favorites WHERE user_id = ?';
    mysql.query(sql, [userId], callback);
  },

  remove: (data, callback) => {
    const sql = 'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?';
    mysql.query(sql, [data.user_id, data.recipe_id], callback);
  }
};

module.exports = Favorite;
