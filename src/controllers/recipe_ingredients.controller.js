const RecipeIngredient = require('../models/recipe_ingredients.model');

exports.addIngredientToRecipe = (req, res) => {
  const data = req.body;
  if (!data.recipe_id || !data.ingredient_id || !data.quantity) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }
  RecipeIngredient.add(data, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Dodano składnik do przepisu' });
  });
};

exports.getIngredientsByRecipe = (req, res) => {
  const recipeId = req.params.recipe_id;
  RecipeIngredient.getAllByRecipe(recipeId, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
