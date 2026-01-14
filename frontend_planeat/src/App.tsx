import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AppLayout from './components/AppLayout.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import IngredientsPage from './pages/IngredientsPage.tsx'
import RecipesPage from './pages/RecipesPage.tsx'
import RecipeDetailsPage from './pages/RecipeDetailsPage.tsx'
import FavoritesPage from './pages/FavoritesPage.tsx'
import FridgePage from './pages/FridgePage.tsx'
import MealPlansPage from './pages/MealPlansPage.tsx'
import MealPlanDetailsPage from './pages/MealPlanDetailsPage.tsx'
import ShoppingListsPage from './pages/ShoppingListsPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { useAuth } from './hooks/useAuth'
import './App.css'

import type { ReactNode } from 'react'

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<AppLayout />}>
        <Route index element={
          <RequireAuth><DashboardPage /></RequireAuth>
        } />
        <Route path="profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="ingredients" element={<RequireAuth><IngredientsPage /></RequireAuth>} />
        <Route path="recipes" element={<RequireAuth><RecipesPage /></RequireAuth>} />
        <Route path="recipes/:recipeId" element={<RequireAuth><RecipeDetailsPage /></RequireAuth>} />
        <Route path="favorites" element={<RequireAuth><FavoritesPage /></RequireAuth>} />
        <Route path="fridge" element={<RequireAuth><FridgePage /></RequireAuth>} />
        <Route path="meal-plans" element={<RequireAuth><MealPlansPage /></RequireAuth>} />
        <Route path="meal-plans/details" element={<RequireAuth><MealPlanDetailsPage /></RequireAuth>} />
        <Route path="shopping-lists" element={<RequireAuth><ShoppingListsPage /></RequireAuth>} />
      </Route>
    </Routes>
  )
}