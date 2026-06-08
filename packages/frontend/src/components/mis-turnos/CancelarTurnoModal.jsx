import { useState } from "react";
import "./CancelarTurnoModal.css";

export default function CancelarTurnoModal({ abierto, onCerrar, onConfirmar }) {
    const [motivo, setMotivo] = useState("");

    if (!abierto) return null;

    const confirmarCancelacion = () => {
        if (!motivo.trim()) {
            return;
        }

        onConfirmar(motivo);
        setMotivo("");
        onCerrar();
    };

    return (
        <div className="modal-overlay" role="presentation">
            <div
              className="cancelar-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancelar-turno-title"
              aria-describedby="cancelar-turno-description"
            >
              <h2 id="cancelar-turno-title">Cancelar turno</h2>

                <p id="cancelar-turno-description">

                
                    ¿Estás seguro de que querés cancelar este turno? Para continuar,
                    indicá el motivo de la cancelación.
                </p>

                <label htmlFor="motivo-cancelacion">Motivo</label>

                <textarea
                  id="motivo-cancelacion"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: No puedo asistir en ese horario"
                />

                <div className="modal-actions">
                    <button
                      className="btn-no-cancelar"
                      onClick={onCerrar}
                      aria-label="Cerrar modal sin cancelar el turno"
                    >
                      No cancelar
                    </button>

                    <button
                      className="btn-confirmar-cancelacion"
                      onClick={confirmarCancelacion}
                      disabled={!motivo.trim()}
                      aria-label="Confirmar cancelación del turno"
                    >
                      Confirmar cancelación
                    </button>
                </div>
            </div>
        </div>
    );
}