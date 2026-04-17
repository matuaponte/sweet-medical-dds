import { ElEnumTiene, EsInstanciaDe, EstanPresentes } from "../../decorators/validador-de-tipos.js";
import { Especialidad } from "../especialidad.js";
import { NivelCobertura } from "../nivelCobertura.js";
import * as z from "zod";

const CoberturaEspecialidadSchema = z.object({
    especialidad: z.instanceof(
        Especialidad,
        { message: "Especialidad inválida", }
    ),
    nivel: z.string().refine(
        (valor) => Object.values(NivelCobertura).includes(valor),
        { message: "Nivel de cobertura inválido" }
    ),
});

export class CoberturaEspecialidad {
    especialidad;
    nivel;

    constructor({ especialidad, nivel }) {
        // validando tipos por nuestra cuenta
        EstanPresentes(especialidad, nivel)
        EsInstanciaDe(especialidad, Especialidad)
        ElEnumTiene(nivel, NivelCobertura)
        // con zod
        const data = CoberturaEspecialidad.parse({especialidad, nivel})
        this.especialidad = especialidad;
        this.nivel = nivel;
    }
}