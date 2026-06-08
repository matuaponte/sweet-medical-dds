import { DiaSemana } from "./diaSemanaEnum.js";
import { ErrorDatosObligatorios } from "./errores.js";


export class DisponibilidadHoraria {
    diaSemana;
    horaDesde;
    horaHasta;
    servicio;
    sede;

    constructor({ diaSemana, horaDesde, horaHasta, servicio, sede }) {
        if (!diaSemana || !horaDesde || !horaHasta || !servicio || !sede) {
            throw new ErrorDatosObligatorios();
        }
        if (!Object.values(DiaSemana).includes(diaSemana)) {
            throw new Error("El día de semana no es válido");
        }
        if (horaDesde >= horaHasta) {
            throw new Error("La hora desde debe ser menor a la hora hasta");
        }
        this.diaSemana = diaSemana;
        this.horaDesde = horaDesde;
        this.horaHasta = horaHasta;
        this.servicio = servicio;
        this.sede = sede;
    }

    seSuperponeCon(otroHorario) {
        if (this.diaSemana !== otroHorario.diaSemana) {
            return false;
        }
        //Si se superponen en el dia, se fija si se superponen en la hora
        //Entonces si la hora de inicio del horario es menor a la hora de fin del otro horario
        //Y la hora de fin del horario es mayor a la hora de inicio del otro horario
        //Entonces se superponen
        return (
            this.horaDesde < otroHorario.horaHasta &&
            this.horaHasta > otroHorario.horaDesde
        );
    }

    // Consultar como administrar la disponibilidad, si manejarla con ID y sacar el mergeo. No tengo manera de modificar una disponiblidad cambiando el horario completamente, solo sumo horarios.
}
