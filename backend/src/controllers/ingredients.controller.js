const Ingredient = require('../models/ingredients.model');

exports.createIngredient = (req, res) => {
  const data = req.body;
  if (!data.ingredient_id || !data.name || !data.unit || !data.capacity) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }
  Ingredient.create(data, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Składnik dodany', id: data.ingredient_id });
  });
};

exports.getAllIngredients = (req, res) => {
  Ingredient.getAll((err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
