import "./Header.css";
import Navbar from "./Navbar.jsx";
import { Link } from "react-router-dom";
import MenuUsuario from "./MenuUsuario.jsx";
import CampanitaNotificacion from "./CampanitaNotification.jsx";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Drawer from "@mui/material/Drawer";
import { useState, useEffect } from "react";
import CarritoTurnos from "../../components/headers/carritoTurnos.jsx"
import { Button } from "@mui/material";

const Header = ({ userName, carrito, limpiarCarrito, eliminarDelCarrito, toggleTheme }) => {
  const [cantUnidades, setCantUnidades] = useState(0);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const cantUnidadesEnCarrito = () => {
    return carrito.length; //por ahora, cada turno es una unidad. Si en el futuro se permite agregar más de un turno a la vez, habría que cambiar esto.
  };

  useEffect(() => {
    setCantUnidades(cantUnidadesEnCarrito());
  }, [carrito]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <img
              src="logo.jpg"
              alt="Logo del Centro Médico"
              className="brand-logo"
            />
            <span className="brand-name">Sweet Medical</span>
          </Link>
        </div>

        <Navbar />

        <div className="header-actions">
          <button className="cart" onClick={() => setCarritoAbierto(true)}>
            <ShoppingCartIcon color="white" />
            <span className="cart-count">{cantUnidades}</span>
          </button>
          {/* <Button onClick={toggleTheme} /> */}
          <CampanitaNotificacion />
          <MenuUsuario userName={userName} />
        </div>
        <Drawer
          anchor="right"
          open={carritoAbierto}
          onClose={() => setCarritoAbierto(false)}
        >
          <CarritoTurnos
            items={carrito}
            onEliminar={eliminarDelCarrito}
            onConfirmar={limpiarCarrito}
            onCerrar={() => setCarritoAbierto(false)}
          />
        </Drawer>
      </div>
    </header>
  );
};

export default Header;
