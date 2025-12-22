const MealPlan = require('../models/meal_plans.model');

exports.createMealPlan = (req, res) => {
  const data = req.body;
  if (!data.plan_id || !data.user_id || !data.name || !data.plan_date) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }
  MealPlan.create(data, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Plan posiłków dodany', id: data.plan_id });
  });
};

exports.getMealPlansByUser = (req, res) => {
  const userId = req.params.user_id;
  MealPlan.getAllByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
