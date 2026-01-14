const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }

  try {
    User.getByUsernameOrEmail(username, email, async (findErr, existing) => {
      if (findErr) return res.status(500).json({ message: findErr.message });
      if (Array.isArray(existing) && existing.length > 0) {
        return res.status(409).json({ message: 'Użytkownik o takiej nazwie lub email już istnieje' });
      }

    const password_hash = await bcrypt.hash(password, 10); // hashowanie hasła

    const userData = { username, email, password_hash };
    User.create(userData, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: 'Użytkownik dodany', id: result.insertId });
    });
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

exports.deleteUser = (req, res) => {
  const userId = req.params.user_id;
  User.remove(userId, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Użytkownik usunięty' });
  });
};

exports.changePassword = (req, res) => {
  const userId = req.params.user_id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'currentPassword i newPassword są wymagane' });
  }

  User.getById(userId, async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    const user = results && results[0];
    if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });

    try {
      const storedHash = user.password_hash;
      let matches = false;

      // Support legacy seeded users where password_hash may be plain text.
      if (typeof storedHash === 'string' && storedHash.startsWith('$2')) {
        matches = await bcrypt.compare(currentPassword, storedHash);
      } else {
        matches = String(currentPassword) === String(storedHash);
      }

      if (!matches) {
        return res.status(401).json({ message: 'Nieprawidłowe obecne hasło' });
      }

      const nextHash = await bcrypt.hash(newPassword, 10);
      User.updatePassword(userId, nextHash, (updateErr) => {
        if (updateErr) return res.status(500).json({ message: updateErr.message });
        res.json({ message: 'Hasło zaktualizowane' });
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
};
