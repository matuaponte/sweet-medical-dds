import { ErrorDatosObligatorios } from "./errores.js";
import { ConflictError } from "../errors/AppError.js";
import { DisponibilidadHoraria } from "./disponibilidadHoraria.js";


export class Medico {
    id;
    usuario;
    matricula;
    nombre;
    honorario;
    especialidades = [];
    practicas = [];
    sedes = [];
    disponibilidades = [];

    constructor({ usuario, matricula, nombre, honorario = 0 }) {
        if (!usuario || !matricula || !nombre) {
            throw new ErrorDatosObligatorios();
        }
        if (matricula.length > 10) {
            throw new Error("Matricula Demasiado larga");
        }
        if (honorario < 0) {
            throw new Error("Honorario inválido");
        }
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
        this.honorario = honorario;
    }

    definirDisponibilidad(disponibilidad) {
        if (!(disponibilidad instanceof DisponibilidadHoraria)) {
            throw new Error("No es una DisponibilidadHoraria valida");
        }

        // TODO: Revisar si el mergeo lo sacamos
        this.disponibilidades.forEach((horarioExistente) => {
            if (disponibilidad.seSuperponeCon(horarioExistente)) {
                throw new ConflictError(
                    "Este horario se superpone con otro horario existente",
                );
            }
        });

        this.disponibilidades.push(disponibilidad);
    }

    modificarDisponibilidad(nuevaDisponibilidad) {
        if (!(nuevaDisponibilidad instanceof DisponibilidadHoraria)) {
            throw new Error("No es una DisponibilidadHoraria válida");
        }

        const existeDisponibilidadEseDia = this.disponibilidades.some(
            (disponibilidad) =>
                disponibilidad.diaSemana === nuevaDisponibilidad.diaSemana,
        );

        if (!existeDisponibilidadEseDia) {
            throw new Error("No existe disponibilidad para ese día");
        }

        this.disponibilidades = this.disponibilidades.filter(
            (disponibilidad) =>
                disponibilidad.diaSemana !== nuevaDisponibilidad.diaSemana,
        );

        this.disponibilidades.push(nuevaDisponibilidad);
    }

    eliminarDisponibilidad(diaSemana) {
        const cantidadAntes = this.disponibilidades.length;

        this.disponibilidades = this.disponibilidades.filter(
            (disponibilidad) => disponibilidad.diaSemana !== diaSemana,
        );

        if (this.disponibilidades.length === cantidadAntes) {
            throw new Error("No existe disponibilidad para ese día");
        }
    }

    agregarServicio(servicio) {
        if (!servicio) {
            throw new Error("Servicio invalido");
        }
        if (servicio.tipo === "Especialidad") {
            if (this.especialidades.some((e) => e.id === servicio.id)) throw new ConflictError("El medico ya tiene esa especialiad");
            this.especialidades.push(servicio);
        } else if (servicio.tipo === "Practica") {
            if (this.practicas.some((p) => p.id === servicio.id)) throw new ConflictError("El medico ya tiene esa practica");
            this.practicas.push(servicio);
        } else {
            throw new Error("Tipo de Servicio invalido");
        }
    }

    eliminarServicio(servicioAEliminar) {
        if (!servicioAEliminar) {
            throw new Error("Servicio invalido");
        }
        if (servicioAEliminar.tipo === "Especialidad") {
            this.especialidades = this.especialidades.filter(
                (especialidad) => especialidad.id !== servicioAEliminar.id,
            );
        } else if (servicioAEliminar.tipo === "Practica") {
            this.practicas = this.practicas.filter(
                (practica) => practica.id !== servicioAEliminar.id,
            );
        } else {
            throw new Error("Tipo de Servicio invalido");
        }
    }

    ofrecePractica(practicaId) {
        return this.practicas.some((practica) => practica.id === practicaId);
    }

    agregarSede(sede) {
        const yaTieneSede = this.sedes.some((s) => s.id === sede.id);

        if (yaTieneSede) {
            throw new ConflictError("El médico ya trabaja en esa sede");
        }

        this.sedes.push(sede);
    }

    eliminarSede(sedeId) {
        const cantidadAntes = this.sedes.length;

        this.sedes = this.sedes.filter((sede) => sede.id !== sedeId);

        if (cantidadAntes === this.sedes.length) {
            throw new Error("La sede no estaba asociada al médico");
        }
    }

    tieneSede(sede) {
        return this.sedes.some((s) => s.id === sede.id);
    }
}
