import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./features/layout/Layout.jsx";
import Login from "./components/login/Login.jsx";
import MisTurnos from "./features/misTurnos/MisTurnos.jsx";
import BusquedaTurnos from "./features/busqueda-turnos/busquedaTurnos.jsx";
import PerfilMedico from "./features/perfil-medico/PerfilMedico.jsx";

import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [carrito, setCarrito] = useState([]); //lista de turnos
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const manejoCarrito = {
    getCarritoAbierto: () => carritoAbierto,
    abrir: () => setCarritoAbierto(true),
    cerrar: () => setCarritoAbierto(false),
    toggle: () => setCarritoAbierto((prev) => !prev),
  }

  const agregarAlCarrito = (turno) => {
    setCarrito([...carrito, turno]);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((_, i) => i !== id));
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  //useEffect(() => {
  //  fetch("http://localhost:8000/hello")
  //    .then((response) => response.json())
  //    .then((data) => setMessage(data.message))
  //    .catch((error) => console.error("Error cargando mensaje.", error));
  //}, []);

      return (
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              carrito={carrito}
              eliminarTurnoDelCarrito={eliminarDelCarrito}
              limpiarElCarrito={limpiarCarrito}
              manejoCarrito={manejoCarrito}
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
                manejoCarrito={manejoCarrito}
              />
            }
          />
    
          <Route
            path="mis-turnos"
            element={<MisTurnos />}
          />

          <Route
            path="perfil-medico"
            element={<PerfilMedico />}
          />
    
          {/* <Route index element={<Home />} /> */}
        </Route>
      <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

export default App;
