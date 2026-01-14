const Recipe = require('../models/recipes.model');

exports.createRecipe = (req, res) => {
  const { name, description, user_id, category } = req.body;

  if (!name || !description || !user_id) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }

  const data = {
    title: name,         // mapowanie name → title
    description,
    user_id,
    category: category || null  // opcjonalne
  };

  Recipe.create(data, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Przepis dodany', id: result.insertId });
  });
};

exports.getAllRecipes = (req, res) => {
  Recipe.getAll((err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
