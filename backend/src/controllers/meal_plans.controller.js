const MealPlan = require('../models/meal_plans.model');

exports.createMealPlan = (req, res) => {
  const data = req.body;
  if (!data.user_id || !data.name || !data.plan_date) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }
  MealPlan.create(data, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Plan posiłków dodany', id: result.insertId });
  });
};

exports.updateMealPlan = (req, res) => {
  const planId = req.params.plan_id;
  const data = req.body;
  if (!data.name || !data.plan_date) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }
  MealPlan.update(planId, data, (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Plan posiłków zaktualizowany' });
  });
};

exports.getMealPlansByUser = (req, res) => {
  const userId = req.params.user_id;
  MealPlan.getAllByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};

exports.deleteMealPlan = (req, res) => {
  const planId = req.params.plan_id;
  if (!planId) return res.status(400).json({ message: 'Pole plan_id jest wymagane' });

  MealPlan.remove(planId, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result && typeof result.affectedRows === 'number' && result.affectedRows === 0) {
      return res.status(404).json({ message: 'Nie znaleziono planu posiłków' });
    }
    res.json({ message: 'Usunięto plan posiłków' });
  });
};
