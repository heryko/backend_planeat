const mysql = require('../db/connection');

const MealPlanRecipe = {
  addRecipe: (data, callback) => {
    const sql = 'INSERT INTO meal_plan_recipes (plan_id, recipe_id, meal_time) VALUES (?, ?, ?)';
    mysql.query(sql, [data.plan_id, data.recipe_id, data.meal_time], callback);
  },

  getByPlan: (planId, callback) => {
    mysql.query('SELECT * FROM meal_plan_recipes WHERE plan_id = ?', [planId], callback);
  }
};

module.exports = MealPlanRecipe;
