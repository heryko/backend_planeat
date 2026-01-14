import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-8 cursor-default select-none hover:opacity-75 transition-opacity"
          >
            <img
              src="/logo.png"
              alt="PlanEat"
              className="w-9 h-9 rounded-xl object-contain"
              draggable={false}
            />
            <span className="text-2xl font-bold text-gray-900">PlanEat</span>
          </div>
          
          <nav className="space-y-2">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/recipes" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Przepisy
            </NavLink>
            <NavLink 
              to="/meal-plans" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Plan posiłków
            </NavLink>
            <NavLink 
              to="/shopping-lists" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Lista zakupów
            </NavLink>
            <NavLink 
              to="/favorites" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Ulubione
            </NavLink>
            <NavLink 
              to="/fridge" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Lodówka
            </NavLink>
            <NavLink 
              to="/ingredients" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Składniki
            </NavLink>
          </nav>
        </div>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <button
            onClick={handleProfileClick}
            className="w-full text-left hover:opacity-75 transition-opacity cursor-pointer"
          >
            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </button>
          <button
            onClick={handleLogout}
            className="absolute bottom-6 right-6 text-gray-400 hover:text-red-600 transition-colors"
            title="Wyloguj się"
          >
            Wyloguj
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex justify-between items-center">
            <div></div>
            <button
              onClick={handleProfileClick}
              className="text-gray-600 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              👤 {user?.username}
            </button>
          </div>
        </header>
        <main className="flex-1 px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
