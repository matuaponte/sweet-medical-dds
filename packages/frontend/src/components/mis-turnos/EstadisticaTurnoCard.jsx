import "./EstadisticaTurnoCard.css";

export default function EstadisticaTurnoCard({ numero, texto, tipo, icono }) {
    return (
        <article className={`stat-card ${tipo}`}>
            <div className="stat-top">
                <div className={`stat-icon ${tipo}`}>{icono}</div>
                <p>{texto}</p>
            </div>

            <span className={`stat-numero ${tipo}`}>{numero}</span>
        </article>
    );
}