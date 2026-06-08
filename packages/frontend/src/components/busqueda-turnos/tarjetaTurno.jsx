import React from "react";
import { useState } from "react";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import StarIcon from "@mui/icons-material/Star";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import "./tarjetaTurno.css";

export default function TarjetaTurno({ turno, especialidades, practicas, carrito, onReservar }) {
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [turnosReservados, setTurnosReservados] = useState(new Set());

  const formatoServicio = (servicio) => {
    if (servicio.tipo === "especialidad") {
      return `${servicio?.nombre} • Consulta general`;
    } else {
      const practica = practicas.find((p) => p.id === servicio.id);
      return `${especialidades.find((e) => e.id === practica.especialidadPadre)?.nombre} • ${practica.nombre}`;
    }
  };
  const formatoHorario = (isoString) => {
    const fecha = new Date(isoString);
    return {
        fecha: fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "short" }),
        hora: fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
    };
  };

  return (
    <div className="tarjeta-turno">

      <div className="info-principal">
        <div className="info-medico">
          <div className="avatar-placeholder">
            <PersonIcon fontSize="24px" />
          </div>

          <div className="datos-turno">
            <h4>{turno.medico.nombre}</h4>

            <p className="especialidad-practica">
              <MedicalServicesIcon fontSize="15px" />
              {formatoServicio(turno.servicio)}
            </p>

            <p className="sede">
              <LocationPinIcon fontSize="15px" />
              {turno.sede.nombre}
            </p>
          </div>
        </div>

        <div className="info-lateral">
                    <span className="badge-cobertura">
                        {turno.estadoCobertura}
                    </span>

          <span className="costo-turno">
            {turno.costo !== 0
              ? `$${turno.costo.toLocaleString()} `
              : "Sin costo"}
          </span>
        </div>
      </div>

      {/* Grid de Turnos inferiores */}
      <div className="seccion-inferior-turnos">
        <p className="titulo-turnos">Próximos turnos disponibles</p>
        <div className="seccion-turnos">
          <div className="grid-turnos">
            {turno.turnos.map((turno, index) => {
              const { fecha, hora } = formatoHorario(turno.horario);
              return (
                <button
                  key={turno.id}
                  className={`boton-turno ${turnoSeleccionado === turno.id ? "seleccionado" : ""}`}
                  disabled={carrito.some((item) => item.id === turno.id)}
                  onClick={() =>
                    !carrito.some((item) => item.id === turno.id) &&
                    setTurnoSeleccionado(turno.id)
                  }
                >
                  <EventNoteIcon fontSize="15px" />
                  <span className="fecha-turno">{fecha}</span>
                  <span className="hora-turno">{hora}</span>
                </button>
              );
            })}
          </div>
          <button
            className="boton-reservar"
            disabled={turnoSeleccionado === null}
            onClick={() => {
              onReservar(turnoSeleccionado);
              setTurnosReservados(prev => new Set(prev).add(turnoSeleccionado));
              setTurnoSeleccionado(null);
            }}
          >
            <AddCircleIcon fontSize="15px" />
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}
