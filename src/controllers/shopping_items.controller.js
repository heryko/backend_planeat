const ShoppingItem = require('../models/shopping_items.model');

exports.addItemToList = (req, res) => {
  const data = req.body;
  if (!data.list_id || !data.ingredient_id || !data.quantity) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }
  ShoppingItem.add(data, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Dodano składnik do listy zakupów' });
  });
};

exports.getItemsByList = (req, res) => {
  const listId = req.params.list_id;
  ShoppingItem.getByList(listId, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
