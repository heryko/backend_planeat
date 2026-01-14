const mysql = require('../db/connection');

const MealPlan = {
  create: (data, callback) => {
    const createdAt = new Date();
    mysql.query(
      'INSERT INTO meal_plans (user_id, name, plan_date, created_at) VALUES (?, ?, ?, ?)',
      [data.user_id, data.name, data.plan_date, createdAt],
      callback
    );
  },

  update: (planId, data, callback) => {
    mysql.query(
      'UPDATE meal_plans SET name = ?, plan_date = ? WHERE plan_id = ?',
      [data.name, data.plan_date, planId],
      callback
    );
  },

  getAllByUser: (userId, callback) => {
    mysql.query(
      'SELECT plan_id, user_id, name, DATE_FORMAT(plan_date, "%Y-%m-%d") AS plan_date, created_at FROM meal_plans WHERE user_id = ?',
      [userId],
      callback
    );
  },

  remove: (planId, callback) => {
    // FK-safe cleanup: detach shopping lists, remove plan recipes, then remove plan day.
    mysql.query('UPDATE shopping_lists SET plan_id = NULL WHERE plan_id = ?', [planId], (err) => {
      if (err) return callback(err);
      mysql.query('DELETE FROM meal_plan_recipes WHERE plan_id = ?', [planId], (err2) => {
        if (err2) return callback(err2);
        mysql.query('DELETE FROM meal_plans WHERE plan_id = ?', [planId], callback);
      });
    });
  }
};

module.exports = MealPlan;
