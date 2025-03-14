import React, { useState } from 'react';
import axios from 'axios';

const FoodSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/foods/search', {
        params: { query, max_results: 50 },
      });
      setFoods(response.data.foods.food || []);
    } catch (err) {
      setError('Error al buscar alimentos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Buscador de Alimentos (FatSecret)</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe un alimento (ej: apple)"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {foods.map((food) => (
          <li key={food.food_id}>
            <strong>{food.food_name}</strong> - {food.food_description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodSearch;