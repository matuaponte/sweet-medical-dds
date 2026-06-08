import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

// Importamos los íconos específicos de Material UI
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";

// Agregamos la propiedad 'icon' a nuestro arreglo de rutas
const navItems = [
  {
    label: "Inicio",
    path: "/",
    icon: <HomeRoundedIcon fontSize="small" />,
  },
  {
    label: "Reservar Turno",
    path: "/busqueda-turnos",
    icon: <CalendarMonthRoundedIcon fontSize="small" />,
  },
  {
    label: "Mis Turnos",
    path: "/mis-turnos",
    icon: <FormatListBulletedRoundedIcon fontSize="small" />,
  },
];

const Navbar = () => {
  return (
    <nav className="navbar-menu">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <NavLink to={item.path} className="nav-link">
              {/* Renderizamos el ícono justo antes del texto */}
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
