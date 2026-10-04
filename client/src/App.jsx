import { useEffect, useState } from "react";
import "./App.css";

const headers = { "Content-Type": "application/json" };

export default function App() {
  const [items, setItems] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  // Rutas relativas (sin "/" inicial) para que funcione bajo /prueba/
  async function cargar() {
    try {
      const res = await fetch("items");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setItems(await res.json());
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function agregar(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    const res = await fetch("items", {
      method: "POST",
      headers,
      body: JSON.stringify({ nombre }),
    });
    if (!res.ok) return setError(`No se pudo crear (${res.status})`);
    setNombre("");
    cargar();
  }

  async function guardar(id) {
    const res = await fetch(`items/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ nombre: editNombre }),
    });
    if (!res.ok) return setError(`No se pudo editar (${res.status})`);
    setEditId(null);
    cargar();
  }

  async function borrar(id) {
    const res = await fetch(`items/${id}`, { method: "DELETE" });
    if (!res.ok) return setError(`No se pudo borrar (${res.status})`);
    cargar();
  }

  return (
    <main className="app">
      <h1>Microservicio de prueba</h1>

      <form onSubmit={agregar} className="fila">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del item"
        />
        <button type="submit">Agregar</button>
      </form>

      {error && <p className="error">{error}</p>}
      {cargando && <p>Cargando...</p>}
      {!cargando && items.length === 0 && !error && (
        <p>No hay items todavía.</p>
      )}

      <ul>
        {items.map((it) => (
          <li key={it._id} className="fila">
            {editId === it._id ? (
              <>
                <input
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  autoFocus
                />
                <button onClick={() => guardar(it._id)}>Guardar</button>
                <button onClick={() => setEditId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <span className="nombre">{it.nombre}</span>
                <button
                  onClick={() => {
                    setEditId(it._id);
                    setEditNombre(it.nombre);
                  }}
                >
                  Editar
                </button>
                <button onClick={() => borrar(it._id)}>Borrar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
