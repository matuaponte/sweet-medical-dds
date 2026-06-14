import "./EstadisticaTurnoCard.css";
import BaseCard from "../../shared/BaseCard/BaseCard";

export default function EstadisticaTurnoCard({ numero, texto, tipo, icono }) {
    return (
        <BaseCard className={`stat-card ${tipo}`}>
            <div className="stat-top">
                <div className={`stat-icon ${tipo}`}>{icono}</div>
                <p>{texto}</p>
            </div>

            <span className={`stat-numero ${tipo}`}>{numero}</span>
        </BaseCard>
    );
}