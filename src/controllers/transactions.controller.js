const Transactions = require('../models/transactions.model');

// T1
exports.createMealPlan = (req, res) => {
  const { user_id, name, plan_date, recipes } = req.body;
  Transactions.createMealPlanWithShoppingList(user_id, { name, plan_date }, recipes, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json(result);
  });
};

// T2
exports.deleteRecipe = (req, res) => {
  const recipeId = req.params.recipe_id;
  Transactions.deleteRecipeWithRelations(recipeId, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// T3
exports.updateRecipeIngredients = (req, res) => {
  const recipeId = req.params.recipe_id;
  const newIngredients = req.body.ingredients;
  Transactions.updateRecipeIngredients(recipeId, newIngredients, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

// T4
exports.updateFridge = (req, res) => {
  const { user_id, recipe_id } = req.body;
  Transactions.updateFridgeAfterMeal(user_id, recipe_id, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};
