import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos react-router-dom
import "./MenuUsuario.css"; // Importamos nuestro nuevo CSS

// Importaciones de Material UI agrupadas para mayor limpieza
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import ModalPerfil from "./ModalPerfil";

export default function MenuUsuario({ userName = "Andino Franco" }) {
  const navigate = useNavigate(); // Hook para navegar por las rutas

  // Estados
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openMenu = Boolean(anchorEl);

  // Manejadores del Menú Desplegable
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Manejadores del Modal
  const handleOpenProfileModal = () => {
    setIsModalOpen(true);
    handleMenuClose();
  };
  const handleCloseModal = () => setIsModalOpen(false);

  // Acción de Cerrar Sesión usando React Router
  const handleLogout = () => {
    handleMenuClose();
    // Aquí a futuro puedes limpiar el localStorage o los tokens de sesión:
    // localStorage.removeItem("token");

    navigate("/login"); // Redirige al inicio o al login
  };

  return (
    <React.Fragment>
      <Box className="menu-user-container">
        <Tooltip title="Configuración de cuenta">
          <IconButton
            onClick={handleMenuClick}
            size="small"
            className="menu-user-btn"
            aria-controls={openMenu ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu}
          >
            <Avatar className="menu-user-avatar">
              {userName[0].toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 0,
            className: "menu-paper-custom", // Aplicamos nuestra clase CSS en lugar del objeto sx
          },
        }}
      >
        <MenuItem onClick={handleOpenProfileModal}>
          <Avatar /> Mi Perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>

      <ModalPerfil
        open={isModalOpen}
        onClose={handleCloseModal}
        userName={userName}
      />
    </React.Fragment>
  );
}
