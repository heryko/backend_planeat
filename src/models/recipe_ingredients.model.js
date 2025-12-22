const mysql = require('../db/connection');

const RecipeIngredient = {
  add: (data, callback) => {
    const sql = 'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)';
    mysql.query(sql, [data.recipe_id, data.ingredient_id, data.quantity], callback);
  },

  getAllByRecipe: (recipeId, callback) => {
    const sql = `
      SELECT ri.recipe_id, ri.ingredient_id, ri.quantity, i.name, i.unit
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
      WHERE ri.recipe_id = ?`;
    mysql.query(sql, [recipeId], callback);
  }
};

module.exports = RecipeIngredient;
