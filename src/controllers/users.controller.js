const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10); // hashowanie hasła

    const userData = { username, email, password_hash };
    User.create(userData, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: 'Użytkownik dodany', id: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateUser = (req, res) => {
  const userData = req.body;
  userData.user_id = req.params.user_id;

  User.update(userData, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Użytkownik zaktualizowany' });
  });
};


exports.getAllUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
