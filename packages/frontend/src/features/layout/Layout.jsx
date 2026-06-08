import { Outlet } from "react-router-dom";
import Header from "../../components/headers/Header.jsx";
import Footer from "../../components/footers/Footer.jsx";
import "./Layout.css";
import { SnackbarProvider } from "../snackbar/Snackbar.jsx";

const Layout = ({ carrito, eliminarTurnoDelCarrito, limpiarElCarrito, toggleTheme }) => {
  return (
    <>
      <div className="app-grid">
        <Header
          className="app-header"
          userName="Andino Franco"
          carrito={carrito}
          eliminarDelCarrito={eliminarTurnoDelCarrito}
          limpiarCarrito={limpiarElCarrito}
          toggleTheme={toggleTheme}
        />
        <main className="app-main">
          {/* Usa el componente que setea un estado global para que lo puedan usar todos */}
          <SnackbarProvider>
            <Outlet />
          </SnackbarProvider>
        </main>
        <Footer className="app-footer" />
      </div>
    </>
  );
};

export default Layout;
