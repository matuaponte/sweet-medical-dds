import { Notificacion } from "./notificacion.js";
import { EstadoTurnoEnum } from "./turnos/estadoTurnoEnum.js";
import { Especialidad } from "./servicios/especialidad.js";
import { Usuario } from "./usuarios/usuario.js";
import { NOTIFICACIONES_ESP } from "../config/notificacionesConstantes.js";

export class FactoryNotificacion {
  static #usuarioSistema;

  // Reemplazo de i18next por un helper de reemplazo simple
  static #t(clave, params) {
    const partes = clave.split(".");
    let template = NOTIFICACIONES_ESP;
    for (const parte of partes) {
      if (template[parte] === undefined) {
        return clave; // Fallback si no existe la clave
      }
      template = template[parte];
    }
    
    if (typeof template !== "string") {
      return template;
    }

    let result = template;
    if (params) {
      for (const key in params) {
        result = result.replace(new RegExp(`{${key}}`, "g"), params[key]);
      }
    }
    return result;
  }
 
  static #params(turno, remitenteNombre, destinatarioNombre) {
    const esEspecialidad = turno.servicio instanceof Especialidad;
    return {
      remitenteNombre: remitenteNombre,
      destinatario: destinatarioNombre,
      tipoServicio: this.#t(esEspecialidad ? "tipoServicio.especialidad" : "tipoServicio.practica"),
      servicio:     turno.servicio?.nombre || "",
      sede:         turno.sede?.nombre || "",
    };
  }
 
  static crearSegunEstadoTurno(turno, remitente, destinatario) {
    const remitenteId = remitente?.idUsuario || remitente?.usuario;
    const destinatarioId = destinatario?.idUsuario || destinatario?.usuario;
    const remitenteNombre = remitente?.nombre || "Usuario";
    const destinatarioNombre = destinatario?.nombre || "Usuario";

    const claveEstado = `estados.${turno.estado}`;

    return new Notificacion({
      destinatario: destinatarioId,
      remitente:    remitenteId,
      mensaje:      this.#t(claveEstado, this.#params(turno, remitenteNombre, destinatarioNombre)),
    });
  }
  
  static crearSegunFechaTurno(turno, destinatario) {
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    
    const fechaTurno = new Date(turno.fechaHora);
    if (fechaTurno.getDate() === mañana.getDate() &&
        fechaTurno.getMonth() === mañana.getMonth() &&
        fechaTurno.getFullYear() === mañana.getFullYear()) {
      
      const destinatarioId = destinatario?.idUsuario || destinatario?.usuario;
      const destinatarioNombre = destinatario?.nombre || "Usuario";
      const remitenteId = this.#usuarioSistema?.id || this.#usuarioSistema?._id || "sistema";

      return new Notificacion({
        destinatario: destinatarioId,
        remitente:    remitenteId,
        mensaje:      this.#t("recordatorio", this.#params(turno, "Sistema", destinatarioNombre)),
      });
    }
    return null;
  }
 
  static setUsuarioSistema(usuario) {
    if (!(usuario instanceof Usuario)) throw new Error("El sistema debe ser un usuario.");
    this.#usuarioSistema = usuario;
  }
}