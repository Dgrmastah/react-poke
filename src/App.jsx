import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState(""); 
  const [pokemon, setPokemon] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  useEffect(() => {
    if (!search) return; 

    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);
      setPokemon(null);

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);

        if (!response.ok) {
          throw new Error("Pokémon no encontrado");
        }

        const data = await response.json();
        setPokemon({
          name: data.name,
          image: data.sprites.front_default,
          types: data.types.map((type) => type.type.name).join(", "),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchPokemon, 500); 
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="container">
      <h1>Buscador de Pokémon</h1>
      <input
        type="text"
        placeholder="Escribe un Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {pokemon && (
        <div className="pokemon-card">
          <h2>{pokemon.name}</h2>
          <img src={pokemon.image} alt={pokemon.name} />
          <p><strong>Tipo:</strong> {pokemon.types}</p>
        </div>
      )}
    </div>
  );
}

export default App;
