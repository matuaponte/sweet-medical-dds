import "./Header.css";
import Navbar from "./Navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import MenuUsuario from "./MenuUsuario.jsx";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CampanitaNotificacion from "./CampanitaNotification.jsx";
import { useState, useEffect } from "react";
import CarritoTurnos from "./carritoTurnos.jsx";
import ModalLogin from "../login/ModalLogin.jsx";
import ModalRegistro from "../auth/ModalRegistro.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from '../../context/CartContext.jsx';
import { useThemeContext } from '../../context/ThemeContext.jsx';
import {
  Drawer,
  Badge,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useAlert } from "../../context/AlertContext.jsx";

const Header = () => {
  const { user } = useAuth(); // Traemos al usuario logueado
  const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const { carrito, limpiarCarrito,  eliminarDelCarrito, manejoCarritoDrawer, counterCarrito } = useCart();
  const {showAlert} = useAlert();

  const [cantUnidades, setCantUnidades] = useState(0);
  const [loginAbierto, setLoginAbierto] = useState(false);
  const [registroAbierto, setRegistroAbierto] = useState(false);

  const handleLoginExitoso = (usuario) => {
    setLoginAbierto(false);
    showAlert(`¡Bienvenido/a de nuevo, ${usuario.nombreUsuario || "usuario"}!`, "success");
  };

  const handleRegistroExitoso = (usuario) => {
    setRegistroAbierto(false);
    showAlert(`¡Cuenta creada exitosamente! Bienvenido/a, ${usuario.nombreUsuario || "usuario"}.`, "success");
    // Redirigimos al paciente a su perfil para que complete su cobertura médica si lo desea
    navigate("/mi-perfil");
  };

  const handleLogoutExitoso = () => {
    showAlert("Sesión cerrada correctamente.", "success");
  };

  // Alternar entre modales
  const abrirRegistro = () => {
    setLoginAbierto(false);
    setRegistroAbierto(true);
  };
  const abrirLogin = () => {
    setRegistroAbierto(false);
    setLoginAbierto(true);
  };

  useEffect(() => {
    setCantUnidades(counterCarrito);
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
          <IconButton onClick={toggleTheme} aria-label="Cambiar modo claro/oscuro">
            { mode == 'light' ? <LightModeIcon sx={{ color: "primary" }}></LightModeIcon> : <DarkModeIcon sx={{ color: "primary" }}></DarkModeIcon>}
          </IconButton>
          <IconButton
            onClick={() => manejoCarritoDrawer.abrir()}
            aria-label="carrito de turnos"
            sx={{ marginRight: 1 }}
          >
            <Badge badgeContent={cantUnidades} color="primary">
              {/* Le puse color 'inherit' asumiendo que el fondo de tu header es oscuro. 
                  Si es blanco, borrale el sx y usá color="primary" */}
              <ShoppingCartIcon sx={{ color: "primary" }} />
            </Badge>
          </IconButton>

          {user && <CampanitaNotificacion />}

          {user ? (
            <MenuUsuario
              userName={user.nombreUsuario || "Usuario"}
              onLogoutSuccess={handleLogoutExitoso}
            />
          ) : (
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                color="primary"
                onClick={abrirRegistro}
                id="btn-registrarse"
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                Registrarse
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={abrirLogin}
                id="btn-iniciar-sesion"
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                Iniciar Sesión
              </Button>
            </Box>
          )}
        </div>

        {/* --- DRAWER DEL CARRITO --- */}
        <Drawer
          anchor="right"
          open={manejoCarritoDrawer.getCarritoAbierto()}
          onClose={() => manejoCarritoDrawer.cerrar()}
        >
          <CarritoTurnos
            items={carrito}
            onEliminar={eliminarDelCarrito}
            onConfirmar={limpiarCarrito}
            onCerrar={() => manejoCarritoDrawer.cerrar()}
          />
        </Drawer>

        {/* --- Modal DE LOGIN --- */}
        <ModalLogin
          open={loginAbierto}
          onClose={() => setLoginAbierto(false)}
          onLoginSuccess={handleLoginExitoso}
          onIrARegistro={abrirRegistro}
        />

        {/* --- Modal DE REGISTRO --- */}
        <ModalRegistro
          open={registroAbierto}
          onClose={() => setRegistroAbierto(false)}
          onRegistroSuccess={handleRegistroExitoso}
          onIrALogin={abrirLogin}
        />
      </div>
    </header>
  );
};

export default Header;


