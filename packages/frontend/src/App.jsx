import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./features/layout/Layout.jsx";
import MisTurnos from "./features/misTurnos/MisTurnos.jsx";
import BusquedaTurnos from "./features/busqueda-turnos/busquedaTurnos.jsx";
import Home from "./features/home/Home.jsx";
import "./App.css";

function App({ toggleTheme }) {
  const [message, setMessage] = useState("");
  const [carrito, setCarrito] = useState([]); //lista de turnos

  const agregarAlCarrito = (turno) => {
    setCarrito([...carrito, turno]);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((_, i) => i !== id));
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error cargando mensaje.", error));
  }, []);

      return (
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              carrito={carrito}
              eliminarTurnoDelCarrito={eliminarDelCarrito}
              limpiarElCarrito={limpiarCarrito}
              toggleTheme={toggleTheme}
            />
          }
        >
          <Route
            path="busqueda-turnos"
            element={
              <BusquedaTurnos
                carrito={carrito}
                agregarTurnoAlCarrito={agregarAlCarrito}
                eliminarTurnoDelCarrito={eliminarDelCarrito}
                limpiarElCarrito={limpiarCarrito}
              />
            }
          />
    
          <Route
            path="mis-turnos"
            element={<MisTurnos />}
          />
          <Route index element={<Home />} />
        </Route>
      </Routes>
    );
  }

export default App;
