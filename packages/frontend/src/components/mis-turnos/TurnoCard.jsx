import "./TurnoCard.css";
import { useState } from "react";
import CancelarTurnoModal from "./CancelarTurnoModal";
import ReprogramarTurnoModal from "./ReprogramarTurnoModal";
import { useNavigate } from "react-router-dom";

export default function TurnoCard({ turno, esHistorial = false, onCancelar }) {
    const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
    const [modalReprogramarAbierto, setModalReprogramarAbierto] = useState(false);
    const navigate = useNavigate();

    const confirmarReprogramacion = (turnoId, nuevoTurno) => {
        console.log("Reprogramando turno:", turnoId);
        console.log("Nuevo horario:", nuevoTurno);
    };

    const confirmarCancelacion = (motivo) => {
        console.log("Cancelando turno:", turno.id);
        console.log("Motivo:", motivo);

        if (onCancelar) {
            onCancelar(turno.id, motivo);
        }
    };
    if (esHistorial) {
        return (
            <article className="turno-card-historial">
                <div className="historial-info">
                    <div className="doctor-avatar historial-avatar">
                        {turno.foto ? (
                            <img src={turno.foto} alt={turno.doctor} />
                        ) : (
                            <span>{turno.doctor.slice(0, 2).toUpperCase()}</span>
                        )}
                    </div>

                    <div>
                        <h3>{turno.doctor}</h3>
                        <p>{turno.fecha} · {turno.especialidad}</p>
                    </div>
                </div>

                <button
                    className="btn-secundario"
                    onClick={() =>
                        navigate("/busqueda-turnos", {
                            state: {
                                doctor: turno.doctor,
                                especialidad: turno.especialidad,
                                sede: turno.sede,
                            },
                        })
                    }
                >
                    Volver a pedir
                </button>
            </article>
        );
    }
    return (
        <>
            <article className={`turno-card ${esHistorial ? "turno-card-historial" : ""}`}>
                <div className="turno-main">
                    <div className="doctor-avatar">
                        {turno.foto ? (
                            <img src={turno.foto} alt={turno.doctor} />
                        ) : (
                            <span>{turno.doctor.slice(0, 2).toUpperCase()}</span>
                        )}
                    </div>

                    <div className="turno-info">
                        <div className="turno-title-row">
                            <div>
                                <h3>{turno.doctor}</h3>
                                <p className="especialidad">{turno.especialidad}</p>
                            </div>

                            <span className={`estado-badge ${turno.estado.toLowerCase()}`}>
                                {turno.estado}
                            </span>
                        </div>

                        <div className="turno-detalles">
                            <span>📅 {turno.fecha}</span>
                            <span>🕒 {turno.hora}</span>
                            <span>📍 {turno.sede}</span>
                        </div>

                        <div className="turno-footer">
                            <div className="cobertura-chip">
                                {turno.cobertura}
                            </div>

                            {!esHistorial ? (
                                <div className="turno-actions">
                                    <button
                                        className="btn-secundario"
                                        onClick={() => setModalReprogramarAbierto(true)}
                                    >
                                        Cambiar fecha
                                    </button>

                                    <button
                                        className="btn-cancelar"
                                        onClick={() => setModalCancelarAbierto(true)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            ) : (
                                <div className="turno-actions">
                                    <button
                                        className="btn-secundario"
                                        onClick={() => navigate("/busqueda-turnos")}
                                    >
                                        Volver a pedir
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            <ReprogramarTurnoModal
                abierto={modalReprogramarAbierto}
                turno={turno}
                onCerrar={() => setModalReprogramarAbierto(false)}
                onConfirmar={confirmarReprogramacion}
            />

            <CancelarTurnoModal
                abierto={modalCancelarAbierto}
                onCerrar={() => setModalCancelarAbierto(false)}
                onConfirmar={confirmarCancelacion}
            />
        </>

    );
}