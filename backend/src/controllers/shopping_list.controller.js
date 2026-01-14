const ShoppingList = require('../models/shopping_list.model');

exports.createShoppingList = (req, res) => {
  const data = req.body;
  if (!data.user_id) {
    return res.status(400).json({ message: 'Pole user_id jest wymagane' });
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

exports.deleteShoppingList = (req, res) => {
  const listId = req.params.list_id;
  if (!listId) return res.status(400).json({ message: 'Pole list_id jest wymagane' });

  ShoppingList.remove(listId, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result && typeof result.affectedRows === 'number' && result.affectedRows === 0) {
      return res.status(404).json({ message: 'Nie znaleziono listy zakupów' });
    }
    res.json({ message: 'Usunięto listę zakupów' });
  });
};
