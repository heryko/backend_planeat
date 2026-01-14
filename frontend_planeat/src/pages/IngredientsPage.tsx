import { useQuery } from '@tanstack/react-query'
import { getIngredients } from '../api/ingredients'

function IngredientsPage() {
  const { data: ingredients, isLoading, error } = useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  })

  if (isLoading) return <div>Ładowanie składników...</div>
  if (error) return <div>{(error as any)?.message || 'Błąd ładowania składników'}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Składniki</h1>
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-emerald-50">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Nazwa</th>
            <th className="p-2">Jednostka</th>
            <th className="p-2">Pojemność</th>
          </tr>
        </thead>
        <tbody>
          {ingredients?.map(i => (
            <tr key={i.ingredient_id} className="even:bg-emerald-50">
              <td className="p-2">{i.ingredient_id}</td>
              <td className="p-2">{i.name}</td>
              <td className="p-2">{i.unit}</td>
              <td className="p-2">{i.capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default IngredientsPage
