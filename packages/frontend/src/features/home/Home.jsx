// import ProductSearchBar from "../../components/productSearchBar/ProductSearchBar";
// import ProductCarousel from "../../components/productCarousel/ProductCarousel";
import "./Home.css";
import Chip from "@mui/material/Chip";
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import BuscadorTurnos from "../../components/buscadorTurnos/BuscadorTurnos";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

const Home = () => {
  return <>
  <div className="home-grid">
    <div className="banner">
      <div className="d-flex flex-column w-50">
        <Chip icon={ <ShieldOutlinedIcon /> } label="Cobertura según tu obra social en tiempo real" />
        <h2>Tu salud, con la atención que mereces</h2>
        <h6 className="text-muted">Encontrá el médico ideal, consultá tu cobertura y reservá tu turno en minutos. Sin llamadas, sin esperas.</h6>
        {/* <BuscadorTurnos/> */}
      </div>
    </div>
    
    <div className="infoEstadistica">  
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column">
          <span>500+</span>
          <span>Profesionales</span>
        </div>
        <div className="d-flex flex-column">
          <span>35+</span>
          <span>Obras Sociales</span>
        </div>
        <div className="d-flex flex-column">
          <span>12.000+</span>
          <span>Turnos reservados</span>
        </div>
        <div className="d-flex flex-column">
          <span>18</span>
          <span>Sedes en AMBA</span>
        </div>
      </div>
    </div>

    <div className="especialidades">
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column">
          <h3>Especialidades</h3>
          <h6 className="text-muted">Encontrá el especialista que necesitas</h6>
        </div>
        <Button/>
      </div>
      {/* TODO */}
      {/* <BotonesQueVanASerFiltrosDeBusqueda/> */}
    </div>

    <div className="profesionales">
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column">
          <h3>Profesionales</h3>
          <h6 className="text-muted">Los mejores valorados por nuestros pacientes</h6>
        </div>
        <Button/>
      </div>
      {/* <CardDeMedico/> */}
    </div>

    <div className="funcionamiento">
      <div className="d-flex flex-column">
        <h3>¿Cómo funciona?</h3>
        <h6 className="text-muted">Reservá tu turno en tres simples pasos</h6>
      </div>
      <Card variant="outlined">{}</Card>
      <Card variant="outlined">{}</Card>
      <Card variant="outlined">{}</Card>
    </div>

    <div className="tieneObraSocial">
      <div>
        <h3>¿Tenés obra social?</h3>
        <h6 className="text-muted">Ingresá tus datos y consultá al instante qué está cubierto para vos.</h6>
      </div>
      <Button/>
    </div>
  </div>
  </>;
};

export default Home;
