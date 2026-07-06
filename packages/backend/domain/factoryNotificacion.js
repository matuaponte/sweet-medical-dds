import { Notificacion } from "./notificacion.js";
import { EstadoTurnoEnum } from "./turnos/estadoTurnoEnum.js";
import { Especialidad } from "./servicios/especialidad.js";
import { Usuario } from "./usuarios/usuario.js";
import i18next from "../config/i18next.js"

export class FactoryNotificacion {
  static #usuarioSistema;

  static #t(clave, params , idiomaDestinatario) {
    return i18next.t(clave, { ns: "notificaciones", ...params });
  }
  
  static #params(turno, destinatario) {
    const esEspecialidad = turno.servicio instanceof Especialidad;
    return {
      paciente:     turno.paciente.nombre,
      medico:       turno.medico.nombre,
      tipoServicio: this.#t(esEspecialidad ? "tipoServicio.especialidad" : "tipoServicio.practica"),
      destinatario: destinatario.nombre,
      servicio:     turno.servicio.nombre,
      sede:         turno.sede.nombre,
    };
  }
 
  static crearSegunEstadoTurnoI(turno, remitente, destinatario) {
    const claveEstado = `estados.${turno.estado}`;
    if (!i18next.exists(claveEstado, { ns: "notificaciones" })) {
      throw new Error(`Estado de turno desconocido: ${turno.estado}`);
    }
 
    return new Notificacion({
      destinatario: destinatario,
      remitente:    remitente,
      mensaje:      this.#t(claveEstado, this.#params(turno, destinatario /*, destinatario.idioma */)),
    });
  }
  
  static crearSegunFechaTurnoI(turno, destinatario) {
    const esMañana = turno.fechaHora.getDay() === new Date().getDay() + 1;
    if (!esMañana) return null;
 
    return new Notificacion({
      destinatario: destinatario,
      remitente:    this.#usuarioSistema,
      mensaje:      this.#t("recordatorio", this.#params(turno, destinatario /*, destinatario.idioma */)),
    });
  }

  static #getId(obj) {
    return obj?.id?.toString() || obj?._id?.toString() || obj?.toString();
  }

  static #esParaPaciente(turno, destinatario) {
    if (!turno.paciente || !destinatario) return false;
    return this.#getId(destinatario) === this.#getId(turno.paciente);
  }

  static crearSegunEstadoTurno(turno, remitente, destinatario) {
    const remitenteId = remitente?.idUsuario || remitente?.usuario;
    const destinatarioId = destinatario?.idUsuario || destinatario?.usuario;
    const remitenteNombre = remitente?.nombre || "Usuario";
    const servicio = turno.servicio?.nombre || "";
    const sede = turno.sede?.nombre || "";
    const pacienteNombre = turno.paciente?.nombre || "";
    const esParaPaciente = this.#esParaPaciente(turno, destinatario);

    switch (turno.estado) {
      case EstadoTurnoEnum.DISPONIBLE:
        return new Notificacion({
          destinatario: destinatarioId,
          remitente: remitenteId,
          mensaje: `📢 Turno disponible\n\n${servicio}\n${sede}`
        });
      case EstadoTurnoEnum.RESERVADO:
        return new Notificacion({
          destinatario: destinatarioId,
          remitente: remitenteId,
          mensaje: esParaPaciente
            ? `📩 Turno reservado\n\n${servicio}\n${sede}`
            : `📩 Nuevo turno solicitado\n\nPaciente: ${pacienteNombre}\n${servicio}\n${sede}`
        });
      case EstadoTurnoEnum.CANCELADO:
        return new Notificacion({
          destinatario: destinatarioId,
          remitente: remitenteId,
          mensaje: esParaPaciente
            ? `❌ Turno cancelado\n\n${servicio}\n${sede}\n\nCancelado por: ${remitenteNombre}`
            : `❌ Turno cancelado\n\nPaciente: ${pacienteNombre}\n${servicio}\n${sede}`
        });
      case EstadoTurnoEnum.CONFIRMADO:
        return new Notificacion({
          destinatario: destinatarioId,
          remitente: remitenteId,
          mensaje: esParaPaciente
            ? `✅ Turno confirmado\n\n${servicio}\n${sede}\n\nConfirmado por: ${remitenteNombre}`
            : `✅ Turno confirmado\n\nPaciente: ${pacienteNombre}\n${servicio}\n${sede}`
        });
      case EstadoTurnoEnum.REALIZADO:
        return new Notificacion({
          destinatario: destinatarioId,
          remitente: remitenteId,
          mensaje: esParaPaciente
            ? `✅ Turno realizado\n\n${servicio}\n${sede}`
            : `✅ Turno realizado\n\nPaciente: ${pacienteNombre}\n${servicio}\n${sede}`
        });
      case EstadoTurnoEnum.PENDIENTECAMBIO:
        return new Notificacion({
          destinatario: destinatarioId,
          remitente: remitenteId,
          mensaje: esParaPaciente
            ? `🔄 Solicitud de cambio de turno\n\n${servicio}\n${sede}\n\nSolicitado por: ${remitenteNombre}`
            : `🔄 Cambio pendiente de confirmación\n\nPaciente: ${pacienteNombre}\n${servicio}\n${sede}`
        });
      default:
        throw new Error("Estado de turno desconocido");
    }
  }

  static crearSegunFechaTurno (turno, destinatario) {
    if(turno.fechaHora.getDay() !== new Date().getDay() + 1) return null;

    const servicio = turno.servicio?.nombre || "";
    const sede = turno.sede?.nombre || "";
    const pacienteNombre = turno.paciente?.nombre || "";
    const esParaPaciente = this.#esParaPaciente(turno, destinatario);

    return new Notificacion({
      destinatario: destinatario,
      remitente: this.#usuarioSistema,
      mensaje: esParaPaciente
        ? `⏰ Recordatorio: turno mañana\n\n${servicio}\n${sede}`
        : `⏰ Recordatorio: turno mañana\n\nPaciente: ${pacienteNombre}\n${servicio}\n${sede}`
    });
  }
 
  static setUsuarioSistema(usuario) {
    if (!(usuario instanceof Usuario)) throw new Error("El sistema debe ser un usuario.");
    this.#usuarioSistema = usuario;
  }
}