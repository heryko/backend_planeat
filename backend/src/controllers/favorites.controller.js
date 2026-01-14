const Favorite = require('../models/favorites.model');

exports.addFavorite = (req, res) => {
  const data = req.body;
  if (!data.user_id || !data.recipe_id) {
    return res.status(400).json({ message: 'user_id i recipe_id są wymagane' });
  }

  Favorite.exists(data.user_id, data.recipe_id, (err, exists) => {
    if (err) return res.status(500).json({ message: err.message });
    if (exists) return res.status(409).json({ message: 'Przepis jest już w ulubionych' });

    Favorite.add(data, (err2) => {
      if (err2) {
        if (err2.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'Przepis jest już w ulubionych' });
        }
        return res.status(500).json({ message: err2.message });
      }
      res.status(201).json({ message: 'Dodano do ulubionych' });
    });
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

exports.removeFavoriteByIds = (req, res) => {
  const userId = req.params.user_id;
  const recipeId = req.params.recipe_id;
  Favorite.remove({ user_id: userId, recipe_id: recipeId }, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Usunięto z ulubionych' });
  });
};
