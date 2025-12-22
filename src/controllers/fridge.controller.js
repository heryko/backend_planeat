const Fridge = require('../models/fridge.model');

exports.addItem = (req, res) => {
  const data = req.body;
  if (!data.user_id || !data.ingredient_id || !data.quantity || !data.expiration_date) {
    return res.status(400).json({ message: 'Brakuje wymaganych pól' });
  }
  Fridge.add(data, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Dodano składnik do lodówki', id: result.insertId });
  });
};

exports.getItems = (req, res) => {
  const userId = req.params.user_id;
  Fridge.getAllByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};

exports.updateQuantity = (req, res) => {
  const { fridge_id, quantity } = req.body;
  Fridge.updateQuantity(fridge_id, quantity, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Zaktualizowano ilość' });
  });
};

exports.removeItem = (req, res) => {
  const { fridge_id } = req.body;
  Fridge.remove(fridge_id, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Usunięto składnik z lodówki' });
  });
};
