const express = require('express');
const app = express();

const usersRoutes = require('./routes/users.routes');
const favoritesRoutes = require('./routes/favorites.routes');
const fridgeRoutes = require('./routes/fridge.routes');
const recipesRoutes = require('./routes/recipes.routes');
const ingredientsRoutes = require('./routes/ingredients.routes');
const recipeIngredientsRoutes = require('./routes/recipe_ingredients.routes');
const mealPlanRecipes = require('./routes/meal_plan_recipes.routes');
const mealPlans = require('./routes/meal_plans.routes');
const shoppingItems = require('./routes/shopping_items.routes');
const shoppingList = require('./routes/shopping_list.routes');

const transactionsRoutes = require('./routes/transactions.routes');

app.use(express.json()); // obsługa JSON w body request

app.use('/transactions', transactionsRoutes);
app.use('/users', usersRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/fridge', fridgeRoutes);
app.use('/recipes', recipesRoutes);
app.use('/ingredients', ingredientsRoutes);
app.use('/recipe_ingredients', recipeIngredientsRoutes);
app.use('/meal_plan_recipes', mealPlanRecipes);
app.use('/meal_plans', mealPlans);
app.use('/shopping_items', shoppingItems);
app.use('/shopping_list', shoppingList);

module.exports = app;
