import "./Home.css";
import Chip from "@mui/material/Chip";
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import BuscadorTurnos from "../../components/buscadorTurnos/BuscadorTurnos";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import CardMedico from "../../components/cardMedico/CardMedico";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();
  const irAVerTurnos = (e) => {
    if (e) e.stopPropagation();
    // evaluar si agregarle estado
    navigate("/busqueda-turnos");
  }
  const medicoEjemplo = {
    id: "60d5f484f1a2c8b1f8e4e1a1",
    nombre: "Dra. María Gómez",
    matricula: "M54321",
    honorario: 15000,
    especialidades: [
      {
        id: "60d5f484f1a2c8b1f8e4e1b1",
        nombre: "Cardiología",
        tipo: "Especialidad",
        duracionEnMins: 30,
        costo: 15000,
      },
    ],
    practicas: [
      {
        id: "60d5f484f1a2c8b1f8e4e1c1",
        nombre: "Electrocardiograma",
        tipo: "Practica",
        duracionEnMins: 20,
        costo: 8000,
        especialidadPadre: { id: "60d5f484f1a2c8b1f8e4e1b1", nombre: "Cardiología" },
      },
    ],
    sedes: [
      { id: "60d5f484f1a2c8b1f8e4e1d1", nombre: "Sede Belgrano", direccion: "Av. Cabildo 1500" },
      { id: "60d5f484f1a2c8b1f8e4e1d2", nombre: "Sede Vicente López", direccion: "Av. Maipú 2500" },
    ],
    disponibilidades: [
      {
        id: "60d5f484f1a2c8b1f8e4e1e1",
        diaSemana: "LUNES",
        horaDesde: "08:00",
        horaHasta: "13:00",
        servicio: { id: "60d5f484f1a2c8b1f8e4e1b1", nombre: "Cardiología" },
        sede: { id: "60d5f484f1a2c8b1f8e4e1d1", nombre: "Sede Belgrano" },
      },
    ],
    usuario: { id: "60d5f484f1a2c8b1f8e4e1f1", nombreUsuario: "mariagomez" },
  };
  const medicos = [medicoEjemplo, medicoEjemplo, medicoEjemplo] 

  return <>
  <div className="home-grid">
    <div className="banner">
      <div className="d-flex flex-column w-50 p-4 banner-titulo">
        <Chip
          className="w-50"
          icon={ <ShieldOutlinedIcon sx={{ color: "white" }}/> }
          label="Cobertura según tu obra social en tiempo real"
          sx={{ color: "white", "& .MuiChip-icon": { color: "white" } }}
        />
        <h2 className="fw-bold titulo">Tu salud, a un clic de distancia</h2>
        <h6 className="banner banner-subtitulo">Gestiona tus turnos médicos de manera fácil y rápida. Encontrá especialistas, revisá tu cobertura y agendá en segundos.</h6>
        <Button className="bg-white gap-3" onClick={irAVerTurnos}>
          <span>Ir a ver turnos</span>
          <ArrowForwardIcon />
        </Button>
      </div>
    </div>
    
    <div className="infoEstadistica">  
      <div className="d-flex justify-content-around align-items-center p-3">
        <div className="d-flex flex-column">
          <span className="spanEstadistica">500+</span>
          <span>Profesionales</span>
        </div>
        <div className="d-flex flex-column">
          <span className="spanEstadistica">35+</span>
          <span>Obras Sociales</span>
        </div>
        <div className="d-flex flex-column">
          <span className="spanEstadistica">12.000+</span>
          <span>Turnos reservados</span>
        </div>
        <div className="d-flex flex-column">
          <span className="spanEstadistica">+18</span>
          <span>Sedes en AMBA</span>
        </div>
      </div>
    </div>

    <div className="profesionales">
      <div className="d-flex justify-content-between bg-white p-3">
        <div className="d-flex flex-column">
          <h3>Profesionales</h3>
          <h6 className="text-muted">Los mejores valorados por nuestros pacientes</h6>
        </div>
        <Button onClick={irAVerTurnos}>Ver todos</Button>
      </div>
      <Box className="d-flex justify-content-around mt-2 p-4 w-100" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2}}>
        {medicos.map((m, i) => (
          <CardMedico key={i} medico={m} />
        ))}
      </Box>
    </div>

    <div className="funcionamiento">
      <div className="d-flex flex-column bg-white p-3">
        <h3>¿Cómo funciona?</h3>
        <h6 className="text-muted">Reservá tu turno en tres simples pasos</h6>
      </div>
      <div className="d-flex justify-content-around w-100 mt-2 p-4">
        <CardContent className="w-25 bg-white rounded">
          <Typography sx={{ color: 'text.secondary', fontSize: 40 }}>
            01
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'secondary.main', // Color del tema (puedes usar un hex de tu paleta, ej: '#1976d2')
              color: 'white',                // Color del icono blanco para que contraste
              borderRadius: '12px',            // Bordes rounded (usa '50%' si quieres un círculo perfecto)
              padding: '12px',                 // Espaciado interno para darle tamaño al bloque
              boxShadow: 2                     // Sombra sutil opcional de MUI
            }}
          >
            <SearchIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" component="div">
            Buscá tu especialidad
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
            Filtrá por especialidad, práctica, sede o rango de fechas. El sistema muestra tu cobertura automáticamente.
          </Typography>
        </CardContent>

        <CardContent className="w-25 bg-white rounded">
          <Typography sx={{ color: 'text.secondary', fontSize: 40 }}>
            02
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'secondary.main', // Color del tema (puedes usar un hex de tu paleta, ej: '#1976d2')
              color: 'white',                // Color del icono blanco para que contraste
              borderRadius: '12px',            // Bordes rounded (usa '50%' si quieres un círculo perfecto)
              padding: '12px',                 // Espaciado interno para darle tamaño al bloque
              boxShadow: 2                     // Sombra sutil opcional de MUI
            }}
          >
            <EventAvailableIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" component="div">
            Elegí tu turno
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Visualizá el costo estimado según tu plan de obra social antes de confirmar la reserva.</Typography>
        </CardContent>

        <CardContent className="w-25 bg-white rounded">
          <Typography sx={{ color: 'text.secondary', fontSize: 40 }}>
            03
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'secondary.main', // Color del tema (puedes usar un hex de tu paleta, ej: '#1976d2')
              color: 'white',                // Color del icono blanco para que contraste
              borderRadius: '12px',            // Bordes rounded (usa '50%' si quieres un círculo perfecto)
              padding: '12px',                 // Espaciado interno para darle tamaño al bloque
              boxShadow: 2                     // Sombra sutil opcional de MUI
            }}
          >
            <CheckCircleIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" component="div">
            Confirmá y listo
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Recibís una notificación al instante. El día previo te enviamos un recordatorio automático.</Typography>
        </CardContent>
      </div>
    </div>

    <div className="tieneObraSocial text-white d-flex justify-content-around align-items-center m-4 rounded">
      <div className="p-3">
        <h3>¿Tenés obra social?</h3>
        <h6 className="tieneObraSocialSubtitulo">Ingresá tus datos y consultá al instante qué está cubierto para vos.</h6>
      </div>
      <Button className="bg-white gap-3 h-50" onClick={irAVerTurnos}>
        <span>Ir a ver turnos</span>
        <ArrowForwardIcon />
      </Button>
    </div>
  </div>
  </>;
};

export default Home;
