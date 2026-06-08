import { Plan } from "./plan.js";
import { ObraSocial } from "./obraSocial.js";
// import { randomUUID } from "crypto";
import { ErrorDatosObligatorios } from "./errores.js";

export class Paciente {
    id;
    usuario;
    dni;
    nombre;
    obraSocial;
    plan;

    constructor({ usuario, dni, nombre }) {
        if (!usuario || !dni || !nombre) {
            throw new ErrorDatosObligatorios();
        }
        this.usuario = usuario;
        this.dni = dni;
        this.nombre = nombre;
    }


    asignarObraSocial(obraSocial) {
        if (!(obraSocial instanceof ObraSocial) && !(typeof obraSocial === "string")) { throw new Error("Obra social inválida"); }
        this.obraSocial = obraSocial;
    }

    asignarPlan(plan) {
        if (!(plan instanceof Plan) && !(typeof plan === "string")) { throw new Error("Plan inválido"); }
        this.plan = plan;
    }

}