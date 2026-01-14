import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../api/users'

function UsersPage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  if (isLoading) return <div>Ładowanie użytkowników...</div>
  if (error) return <div>{(error as any)?.message || 'Błąd ładowania użytkowników'}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Użytkownicy</h1>
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-emerald-50">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nazwa</th>
            <th className="p-2">Email</th>
            <th className="p-2">Rola</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(u => (
            <tr key={u.user_id} className="even:bg-emerald-50">
              <td className="p-2">{u.user_id}</td>
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default UsersPage
