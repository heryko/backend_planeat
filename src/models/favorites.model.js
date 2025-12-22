const mysql = require('../db/connection');

const Favorite = {
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
