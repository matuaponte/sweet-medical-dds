import { Avatar, Box, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import LocationPinIcon from "@mui/icons-material/LocationPin"
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import "./CardMedico.css"

export default function CardMedico({ medico, color = "primary" }) {

    const navigate = useNavigate();
    const letraInicialMedico = medico?.nombre?.[0] || "?";
    const especialidad = medico?.especialidades?.[0]?.nombre || medico?.practicas?.[0]?.nombre;
    const sede = medico?.sedes?.[0];

    const irAVerTurnos = (e) => {
        if (e) e.stopPropagation();
        // evaluar si agregarle estado
        navigate("/busqueda-turnos");
    }

    return (
        <Box className="medico-grid bg-white rounded p-2" onClick={irAVerTurnos}>
            <div className="presentacion d-flex gap-2 mb-5">    
                <Avatar className="icono" sx={{ bgcolor: `${color}.main`, color: `${color}.contrastText` }}>{letraInicialMedico}</Avatar>
                <div className="presentacion d-flex flex-column">
                    <span>{medico.nombre}</span>
                    <span className="colorPrimario">
                        {especialidad}
                    </span>
                </div>
            </div>
            <span className="sede">
                <LocationPinIcon fontSize="samll me-2"/>
                <span>{sede?.nombre || ""}</span>
            </span>
            <span className="turnos colorPrimario">
                <EventAvailableIcon fontSize="small me-2"/>
                <span>6 turnos disponibles</span>
            </span>
        </Box>
    )
}