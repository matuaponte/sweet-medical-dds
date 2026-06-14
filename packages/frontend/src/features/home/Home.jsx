import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Button, CardContent, Chip, Typography, Box } from "@mui/material";
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TituloSeccion from "../../shared/TituloSeccion/TituloSeccion";
import BaseCard from "../../shared/BaseCard/BaseCard"

const Home = () => {

  const navigate = useNavigate();
  const irAVerTurnos = (e) => {
    if (e) e.stopPropagation();
    // evaluar si agregarle estado
    navigate("/busqueda-turnos");
  }
  return <>
  <div className="home-grid">
    <div className="banner p-5">
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

    <div className="funcionamiento">
      <div className="d-flex flex-column bg-white p-5">
        <TituloSeccion>¿Cómo funciona?</TituloSeccion>
        <h6 className="text-muted">Reservá tu turno en tres simples pasos</h6>
      </div>
      <div className="d-flex justify-content-around w-100 mt-2 p-5 gap-5">
        <BaseCard className="w-25 bg-white rounded">
          <CardContent>
            <Box sx={{ display: "inline-flex"}}>
              <Typography sx={{ color: 'text.secondary', fontSize: 40 }}>
                01
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  padding: '12px'
                }}
              >
                <SearchIcon fontSize="medium" />
              </Box>
            </Box>
            <Typography variant="h5" component="div">
              Buscá tu especialidad
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
              Filtrá por especialidad, práctica, sede o rango de fechas. El sistema muestra tu cobertura automáticamente.
            </Typography>
          </CardContent>
        </BaseCard>

        <BaseCard className="w-25 bg-white rounded">
          <CardContent>
            <Box sx={{ display: "inline-flex"}}>
              <Typography sx={{ color: 'text.secondary', fontSize: 40 }}>
                02
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  padding: '12px'
                }}
              >
                <EventAvailableIcon fontSize="medium" />
              </Box>
            </Box>
            <Typography variant="h5" component="div">
              Elegí tu turno
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Visualizá el costo estimado según tu plan de obra social antes de confirmar la reserva.</Typography>
          </CardContent>
        </BaseCard>

        <BaseCard className="w-25 bg-white rounded">
          <CardContent>
            <Box sx={{ display: "inline-flex"}}>
              <Typography sx={{ color: 'text.secondary', fontSize: 40 }}>
                03
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  padding: '12px',
                }}
              >
                <CheckCircleIcon fontSize="medium" />
              </Box>
            </Box>
            <Typography variant="h5" component="div">
              Confirmá y listo
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Recibís una notificación al instante. El día previo te enviamos un recordatorio automático.</Typography>
          </CardContent>
        </BaseCard>
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
