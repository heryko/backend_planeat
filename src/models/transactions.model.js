const mysql = require('../db/connection');

const Transactions = {

  // T1: Utworzenie dnia i listy zakupów
  createMealPlanWithShoppingList: async (userId, planData, recipes, callback) => {
    const connection = await mysql.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Dodanie planu posiłków
      const [planResult] = await connection.query(
        'INSERT INTO meal_plans (user_id, name, plan_date, created_at) VALUES (?, ?, ?, ?)',
        [userId, planData.name, planData.plan_date, new Date()]
      );
      const planId = planResult.insertId;

      // 2. Dodanie przepisów do planu
      for (const r of recipes) {
        await connection.query(
          'INSERT INTO meal_plan_recipes (plan_id, recipe_id, meal_time) VALUES (?, ?, ?)',
          [planId, r.recipe_id, r.meal_time]
        );
      }

      // 3. Stworzenie listy zakupów
      const [listResult] = await connection.query(
        'INSERT INTO shopping_lists (user_id, plan_id, created_at) VALUES (?, ?, ?)',
        [userId, planId, new Date()]
      );
      const listId = listResult.insertId;

      // 4. Dodanie składników z przepisów
      for (const r of recipes) {
        const [ingredients] = await connection.query(
          'SELECT ingredient_id, quantity FROM recipe_ingredients WHERE recipe_id = ?',
          [r.recipe_id]
        );
        for (const ing of ingredients) {
          await connection.query(
            'INSERT INTO shopping_items (list_id, ingredient_id, quantity) VALUES (?, ?, ?)',
            [listId, ing.ingredient_id, ing.quantity]
          );
        }
      }

      await connection.commit();
      callback(null, { planId, listId });
    } catch (err) {
      await connection.rollback();
      callback(err);
    } finally {
      connection.release();
    }
  },

  // T2: Usunięcie przepisu z zachowaniem spójności
  deleteRecipeWithRelations: async (recipeId, callback) => {
   const connection = await mysql.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [recipeId]);
      await connection.query('DELETE FROM favorites WHERE recipe_id = ?', [recipeId]);
      await connection.query('DELETE FROM meal_plan_recipes WHERE recipe_id = ?', [recipeId]);
      await connection.query('DELETE FROM recipes WHERE recipe_id = ?', [recipeId]);

      await connection.commit();
      callback(null, { message: 'Przepis i powiązania usunięte' });
    } catch (err) {
      await connection.rollback();
      callback(err);
    } finally {
      connection.release();
    }
  },

  // T3: Aktualizacja przepisu (składników)
  updateRecipeIngredients: async (recipeId, newIngredients, callback) => {
    const connection = await mysql.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [recipeId]);

      for (const ing of newIngredients) {
        await connection.query(
          'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)',
          [recipeId, ing.ingredient_id, ing.quantity]
        );
      }

      await connection.commit();
      callback(null, { message: 'Składniki przepisu zaktualizowane' });
    } catch (err) {
      await connection.rollback();
      callback(err);
    } finally {
      connection.release();
    }
  },

  // T4: Aktualizacja lodówki (Fridge)
  updateFridgeAfterMeal: async (userId, recipeId, callback) => {
   const connection = await mysql.getConnection();
    try {
      await connection.beginTransaction();

      const [ingredients] = await connection.query(
        'SELECT ingredient_id, quantity FROM recipe_ingredients WHERE recipe_id = ?',
        [recipeId]
      );

      for (const ing of ingredients) {
        await connection.query(
          'UPDATE fridge SET quantity = quantity - ? WHERE user_id = ? AND ingredient_id = ?',
          [ing.quantity, userId, ing.ingredient_id]
        );
      }

      await connection.commit();
      callback(null, { message: 'Lodówka zaktualizowana' });
    } catch (err) {
      await connection.rollback();
      callback(err);
    } finally {
      connection.release();
    }
  }

};

module.exports = Transactions;
