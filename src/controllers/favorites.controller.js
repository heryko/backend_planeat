const Favorite = require('../models/favorites.model');

exports.addFavorite = (req, res) => {
  const data = req.body;
  if (!data.user_id || !data.recipe_id) {
    return res.status(400).json({ message: 'user_id i recipe_id są wymagane' });
  }
  Favorite.add(data, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Dodano do ulubionych' });
  });
};

exports.getFavorites = (req, res) => {
  const userId = req.params.user_id;
  Favorite.getAllByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};

exports.removeFavorite = (req, res) => {
  const data = req.body;
  Favorite.remove(data, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Usunięto z ulubionych' });
  });
};
