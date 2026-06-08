import "./MisTurnos.css";
import TurnoCard from "../../components/mis-turnos/TurnoCard";
import EstadisticaTurnoCard from "../../components/mis-turnos/EstadisticaTurnoCard";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { useState, useEffect } from "react";
import TurnosEmptyState from "../../components/mis-turnos/TurnosEmptyState";
import TurnoCardSkeleton from "../../components/mis-turnos/TurnoCardSkeleton";
import EstadisticaTurnoCardSkeleton from "../../components/mis-turnos/EstadisticaTurnoCardSkeleton";
import TurnoHistorialSkeleton from "../../components/mis-turnos/TurnoHistorialSkeleton";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/mis-turnos/Toast";
import { proximosTurnos, historialTurnos } from "../../mockdata/turnos";

export default function MisTurnos() {
    const [paginaProximos, setPaginaProximos] = useState(1);
    const [paginaHistorial, setPaginaHistorial] = useState(1);
    const [loading, setLoading] = useState(true);
    const [toastVisible, setToastVisible] = useState(false);
    const turnosPorPagina = 3;
    const navigate = useNavigate();

    const totalPaginasProximos = Math.ceil(proximosTurnos.length / turnosPorPagina);

    const proximosTurnosAMostrar = proximosTurnos.slice(
        (paginaProximos - 1) * turnosPorPagina,
        paginaProximos * turnosPorPagina
    );

    const handleTurnoCancelado = (turnoId, motivo) => {
        console.log("Turno cancelado:", turnoId, motivo);

        setToastVisible(true);

        setTimeout(() => {
            setToastVisible(false);
        }, 1500);
    };

    const totalPaginasHistorial = Math.ceil(historialTurnos.length / turnosPorPagina);

    const historialTurnosAMostrar = historialTurnos.slice(
        (paginaHistorial - 1) * turnosPorPagina,
        paginaHistorial * turnosPorPagina
    );

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    return (
        <section className="mis-turnos-page">
            <div className="mis-turnos-header">
                <div className="header-content">
                    <span className="saludo">
                        👋 Hola, <strong>Usuario</strong>
                    </span>

                    <h1>Mis Turnos</h1>

                    <p>
                        Tenés <strong>2 turnos próximos</strong> programados. Desde acá podés
                        consultar, reprogramar o cancelar tus citas médicas.
                    </p>
                </div>

                <div className="header-actions">
                    <button
                        className="nuevo-turno-btn"
                        onClick={() => navigate("/busqueda-turnos")}
                    >
                        Nuevo turno
                    </button>
                </div>
            </div>

            <Toast
                visible={toastVisible}
                mensaje="Turno cancelado correctamente."
            />

            <div className="stats-grid">
                {loading ? (
                    <>
                        <EstadisticaTurnoCardSkeleton />
                        <EstadisticaTurnoCardSkeleton />
                        <EstadisticaTurnoCardSkeleton />
                        <EstadisticaTurnoCardSkeleton />
                    </>
                ) : (
                    <>
                        <EstadisticaTurnoCard
                            numero="2"
                            texto="Turnos próximos"
                            tipo="azul"
                            icono={<CalendarMonthRoundedIcon />}
                        />

                        <EstadisticaTurnoCard
                            numero="1"
                            texto="Turnos realizados"
                            tipo="verde"
                            icono={<CheckCircleRoundedIcon />}
                        />

                        <EstadisticaTurnoCard
                            numero="1"
                            texto="Cancelados"
                            tipo="rojo"
                            icono={<CancelRoundedIcon />}
                        />

                        <EstadisticaTurnoCard
                            numero="2"
                            texto="Notif. sin leer"
                            tipo="naranja"
                            icono={<NotificationsRoundedIcon />}
                        />
                    </>
                )}
            </div>

            <h2 className="section-title">Próximos Turnos</h2>

            {loading ? (
                <>
                    <TurnoCardSkeleton />
                    <TurnoCardSkeleton />
                    <TurnoCardSkeleton />
                </>
            ) : proximosTurnos.length === 0 ? (
                <TurnosEmptyState
                    titulo="No tenés turnos próximos"
                    descripcion="Cuando reserves un turno, lo vas a ver listado en esta sección."
                    textoBoton="Reservar un turno"
                    onClick={() => navigate("/busqueda-turnos")}
                />
            ) : (
                <>
                    <div className="turnos-lista">
                        {proximosTurnosAMostrar.map((turno) => (
                            <TurnoCard key={turno.id} turno={turno} onCancelar={handleTurnoCancelado} />
                        ))}
                    </div>

                    {totalPaginasProximos > 1 && (
                        <div className="paginacion-turnos">
                            <button
                                disabled={paginaProximos === 1}
                                onClick={() => setPaginaProximos(paginaProximos - 1)}
                            >
                                Anterior
                            </button>

                            <span>
                                Página {paginaProximos} de {totalPaginasProximos}
                            </span>

                            <button
                                disabled={paginaProximos === totalPaginasProximos}
                                onClick={() => setPaginaProximos(paginaProximos + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}

            <h2 className="section-title historial-title">Historial</h2>

            {loading ? (
                <>
                    <TurnoHistorialSkeleton />
                    <TurnoHistorialSkeleton />
                    <TurnoHistorialSkeleton />
                </>
            ) : historialTurnos.length === 0 ? (
                <div className="historial-empty-state">
                    <span>📋</span>
                    <p>No tenés turnos previos.</p>
                </div>
            ) : (
                <>
                    <div className="turnos-lista">
                        {historialTurnosAMostrar.map((turno) => (
                            <TurnoCard
                                key={turno.id}
                                turno={turno}
                                esHistorial
                            />
                        ))}
                    </div>

                    {totalPaginasHistorial > 1 && (
                        <div className="paginacion-turnos">
                            <button
                                disabled={paginaHistorial === 1}
                                onClick={() => setPaginaHistorial(paginaHistorial - 1)}
                            >
                                Anterior
                            </button>

                            <span>
                                Página {paginaHistorial} de {totalPaginasHistorial}
                            </span>

                            <button
                                disabled={paginaHistorial === totalPaginasHistorial}
                                onClick={() => setPaginaHistorial(paginaHistorial + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}


        </section>
    );
}