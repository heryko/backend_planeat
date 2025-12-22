const ShoppingList = require('../models/shopping_list.model');

exports.createShoppingList = (req, res) => {
  const data = req.body;
  if (!data.user_id || !data.plan_id) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }
  ShoppingList.create(data, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Lista zakupów dodana', id: result.insertId });
  });
};

exports.getShoppingListsByUser = (req, res) => {
  const userId = req.params.user_id;
  ShoppingList.getByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
