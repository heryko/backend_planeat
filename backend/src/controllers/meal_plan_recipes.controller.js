const MealPlanRecipe = require('../models/meal_plan_recipes.model');

exports.addRecipeToPlan = (req, res) => {
  const data = req.body;
  if (!data.plan_id || !data.recipe_id || !data.meal_time) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }
  MealPlanRecipe.addRecipe(data, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: 'Przepis dodany do planu' });
  });
};

exports.getRecipesByPlan = (req, res) => {
  const planId = req.params.plan_id;
  MealPlanRecipe.getByPlan(planId, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
