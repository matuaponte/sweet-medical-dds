import { Notificacion } from "./notificacion.js";
import { EstadoTurnoEnum } from "./turnos/estadoTurnoEnum.js";
import { Especialidad } from "./servicios/especialidad.js";
import { Usuario } from "./usuario.js";
//import {i18next} from "./config/i18n.js";

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

  static crearSegunEstadoTurno(turno, remitente, destinatario) {
    switch (turno.estado) {
      case EstadoTurnoEnum.DISPONIBLE:
        return new Notificacion({
          destinatario: destinatario,
          remitente: remitente,
          mensaje:
            `El turno volvió a estar disponible
            - Para el servicio: ${turno.servicio.nombre}
            - En la sede: ${turno.sede.nombre}`
        });
      case EstadoTurnoEnum.RESERVADO:
        return new Notificacion({
          destinatario: destinatario,
          remitente: remitente,
          mensaje:
            `El turno fue reservado por el usuario ${remitente.nombre} 
            - Para el servicio: ${turno.servicio.nombre}
            - En la sede: ${turno.sede.nombre}`
        });
      case EstadoTurnoEnum.CANCELADO:
        return new Notificacion({
          destinatario: destinatario,
          remitente: remitente,
          mensaje:
            `El turno fue cancelado por el usuario ${remitente.nombre} 
            - Para el servicio: ${turno.servicio.nombre}
            - En la sede: ${turno.sede.nombre}`
        });
      case EstadoTurnoEnum.CONFIRMADO:
        return new Notificacion({
          destinatario: destinatario,
          remitente: remitente,
          mensaje:
            `El turno fue confirmado por el usuario ${remitente.nombre}
            - Para el servicio: ${turno.servicio.nombre} 
            - En la sede: "${turno.sede.nombre}`
        });
      case EstadoTurnoEnum.REALIZADO:
        return new Notificacion({
          destinatario: destinatario,
          remitente: remitente,
          mensaje:
            `Turno Realizado
            - Para el servicio: ${turno.servicio.nombre}
            - En la sede: "${turno.sede.nombre}`
        });
      case EstadoTurnoEnum.PENDIENTECAMBIO:
        return new Notificacion({
          destinatario: destinatario,
          remitente: remitente,
          mensaje:
            `El turno fue puesto en pendiente de cambio por el usuario ${remitente.nombre}
            - Para el servicio: " ${turno.servicio.nombre}
            - En la sede: " ${turno.sede.nombre}`
        });
      default:
        throw new Error("Estado de turno desconocido");
    }
  }

  static crearSegunFechaTurno (turno, destinatario) {
    if(turno.fechaHora.getDay() === new Date().getDay() + 1) {
      return new Notificacion({
          destinatario: destinatario,
          remitente: this.#usuarioSistema,
          mensaje:
            `Hola, señor/a ${destinatario.nombre}! Desde Sweet Medical le recordamos que su turno
            ${turno.servicio instanceof Especialidad ? "para la especialidad" : "con la practica"} ${turno.servicio.nombre} 
            en la sede ${turno.sede.nombre} 
            es el día de mañana.`
        });
    }
  }
 
  static setUsuarioSistema(usuario) {
    if (!(usuario instanceof Usuario)) throw new Error("El sistema debe ser un usuario.");
    this.#usuarioSistema = usuario;
  }
}