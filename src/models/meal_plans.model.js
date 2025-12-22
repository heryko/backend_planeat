const mysql = require('../db/connection');

const MealPlan = {
  create: (data, callback) => {
    const createdAt = new Date();
    mysql.query(
      'INSERT INTO meal_plans (plan_id, user_id, name, plan_date, created_at) VALUES (?, ?, ?, ?, ?)',
      [data.plan_id, data.user_id, data.name, data.plan_date, createdAt],
      callback
    );
  },

  getAllByUser: (userId, callback) => {
    mysql.query('SELECT * FROM meal_plans WHERE user_id = ?', [userId], callback);
  }
};

module.exports = MealPlan;
