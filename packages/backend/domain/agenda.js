import { Turno } from "./turnos/turno.js";
import { EstadoTurnoEnum } from "./turnos/estadoTurnoEnum.js";
import { DiaSemana } from "./diaSemanaEnum.js";

export class Agenda {
    generarTurnosSegunDisponibilidadDelMedico(medico) {
        const turnos = [];
        const fechas = this.obtenerProximosDias(30);

        for (const fecha of fechas) {
            const diaSemana = this.obtenerDiaSemana(fecha);

            const disponibilidadesDelDia = medico.disponibilidades.filter(
                disponibilidad => disponibilidad.diaSemana === diaSemana
            );

            for (const disponibilidad of disponibilidadesDelDia) {
                const duracion = disponibilidad.servicio.duracionTurnoEnMins;
                const slots = this.generarSlots(fecha, disponibilidad, duracion);

                for (const fechaHora of slots) {
                    turnos.push(new Turno({
                        medico: medico.id,
                        fechaHora,
                        sede: disponibilidad.sede.id,
                        servicio: disponibilidad.servicio.id,
                        estado: EstadoTurnoEnum.DISPONIBLE,
                        costo: disponibilidad.servicio.costo + medico.honorario,
                    }));
                }
            }
        }

        return turnos;
    }

    obtenerProximosDias(cantidadDias) {
        const fechas = [];

        for (let i = 0; i < cantidadDias; i++) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + i);
            fechas.push(fecha);
        }

        return fechas;
    }

    obtenerDiaSemana(fecha) {
        const dias = [
            DiaSemana.DOMINGO,
            DiaSemana.LUNES,
            DiaSemana.MARTES,
            DiaSemana.MIERCOLES,
            DiaSemana.JUEVES,
            DiaSemana.VIERNES,
            DiaSemana.SABADO
        ];

        return dias[fecha.getDay()];
    }

    generarSlots(fechaBase, disponibilidad, duracionEnMinutos) {
        const slots = [];

        let actual = this.fechaConHora(fechaBase, disponibilidad.horaDesde);
        const fin = this.fechaConHora(fechaBase, disponibilidad.horaHasta);

        while (actual < fin) {
            const posibleFin = new Date(actual.getTime() + duracionEnMinutos * 60 * 1000);

            if (posibleFin <= fin) {
                slots.push(new Date(actual));
            }

            actual = posibleFin;
        }

        return slots;
    }

    fechaConHora(fechaBase, hora) {
        const [horas, minutos] = hora.split(":").map(Number);

        const fecha = new Date(fechaBase);
        fecha.setHours(horas, minutos, 0, 0);

        return fecha;
    }


    refresacarTurnosSegunDisponibilidad({medico}) {
        return [];
    }
}