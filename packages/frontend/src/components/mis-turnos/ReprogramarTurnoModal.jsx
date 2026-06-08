import { useState, useEffect } from "react";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import "./ReprogramarTurnoModal.css";

const turnosDisponiblesMock = [
    { id: 1, fecha: "9 Jun", hora: "08:00" },
    { id: 2, fecha: "9 Jun", hora: "08:30" },
    { id: 3, fecha: "9 Jun", hora: "14:00" },
    { id: 4, fecha: "10 Jun", hora: "08:00" },
    { id: 5, fecha: "10 Jun", hora: "08:30" },
    { id: 6, fecha: "10 Jun", hora: "14:00" },
    { id: 7, fecha: "11 Jun", hora: "08:00" },
    { id: 8, fecha: "11 Jun", hora: "08:30" },
    { id: 9, fecha: "12 Jun", hora: "14:30" },
];

export default function ReprogramarTurnoModal({
    abierto,
    turno,
    onCerrar,
    onConfirmar,
}) {
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        if (!abierto) return;

        setLoadingSlots(true);

        const timer = setTimeout(() => {
            setLoadingSlots(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [abierto]);

    if (!abierto) return null;

    const confirmarCambio = () => {
        if (!turnoSeleccionado) return;

        onConfirmar(turno.id, turnoSeleccionado);
        setTurnoSeleccionado(null);
        onCerrar();
    };

    return (
        <div className="modal-overlay">
            <div className="reprogramar-modal">
                <div className="reprogramar-header">
                    <div>
                        <h2>Cambiar fecha</h2>
                        <p>Elegí un nuevo horario disponible para este turno.</p>
                    </div>

                    <button className="modal-close-btn" onClick={onCerrar}>
                        ×
                    </button>
                </div>

                <div className="turno-actual-box">
                    <div className="doctor-avatar reprogramar-avatar">
                        {turno.foto ? (
                            <img src={turno.foto} alt={turno.doctor} />
                        ) : (
                            <span>{turno.doctor.slice(0, 2).toUpperCase()}</span>
                        )}
                    </div>

                    <div>
                        <h3>{turno.doctor}</h3>
                        <p>{turno.especialidad}</p>

                        <div className="reprogramar-detalles">
                            <span>
                                <CalendarMonthRoundedIcon fontSize="small" />
                                {turno.fecha}
                            </span>

                            <span>
                                <AccessTimeRoundedIcon fontSize="small" />
                                {turno.hora}
                            </span>

                            <span>
                                <LocationOnRoundedIcon fontSize="small" />
                                {turno.sede}
                            </span>
                        </div>
                    </div>
                </div>

                <h4>Próximos turnos disponibles</h4>

                {loadingSlots ? (
                    <div className="slots-loading">
                        <div className="medical-loader"></div>
                        <p>Buscando turnos disponibles...</p>
                    </div>
                ) : (
                    <div className="slots-grid">
                        {turnosDisponiblesMock.map((slot) => (
                            <button
                                key={slot.id}
                                className={`slot-btn ${turnoSeleccionado?.id === slot.id ? "selected" : ""
                                    }`}
                                onClick={() => setTurnoSeleccionado(slot)}
                            >
                                <CalendarMonthRoundedIcon fontSize="small" />
                                <span>{slot.fecha}</span>
                                <strong>{slot.hora}</strong>
                            </button>
                        ))}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn-no-cancelar" onClick={onCerrar}>
                        Volver
                    </button>

                    <button
                        className="btn-confirmar-reprogramacion"
                        disabled={!turnoSeleccionado}
                        onClick={confirmarCambio}
                    >
                        Confirmar cambio
                    </button>
                </div>
            </div>
        </div>
    );
}