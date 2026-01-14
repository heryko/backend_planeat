const bcrypt = require('bcrypt');
const User = require('../models/user.model');

exports.login = (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'identifier i password są wymagane' });
  }

  User.getByIdentifier(identifier, async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    const user = results && results[0];
    if (!user) return res.status(401).json({ message: 'Nieprawidłowa nazwa/email lub hasło' });

    try {
      const storedHash = user.password_hash;
      let matches = false;

      // Support legacy seeded users where password_hash may be plain text.
      if (typeof storedHash === 'string' && storedHash.startsWith('$2')) {
        matches = await bcrypt.compare(password, storedHash);
      } else {
        matches = String(password) === String(storedHash);
      }

      if (!matches) {
        return res.status(401).json({ message: 'Nieprawidłowa nazwa/email lub hasło' });
      }

      return res.json({
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role || 'user',
          created_at: user.created_at,
        },
      });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  });
};
