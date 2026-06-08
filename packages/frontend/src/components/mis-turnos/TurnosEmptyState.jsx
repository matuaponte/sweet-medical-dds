import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import "./TurnosEmptyState.css";

export default function TurnosEmptyState({
    titulo,
    descripcion,
    textoBoton,
    onClick
}) {
    return (
        <div className="turnos-empty-state">
            <div className="empty-icon">
                <CalendarMonthRoundedIcon />
            </div>

            <h3>{titulo}</h3>

            <p>{descripcion}</p>

            <button
                className="empty-action-btn"
                onClick={onClick}
            >
                {textoBoton}
            </button>
        </div>
    );
}