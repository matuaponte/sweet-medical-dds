import { z } from "zod";
import { EstadoTurnoEnum } from "../../domain/turnos/estadoTurnoEnum.js";
import { objectIdSchema } from "./objectIdSchema.js";


export const idParamsSchema = z.object({
    id: z.string("El id debe ser un UUID válido")
});

export const bodyCambioEstadoTurnoSchema = z.object({
    nuevoEstado: z.enum(EstadoTurnoEnum, { error: "El estado del turno no es válido" }),
    quien: objectIdSchema("usuario"),
    motivo: z.string("El motivo debe ser una cadena de texto").optional()
});

export const bodyAsignarTurnoSchema = z.object({
    costoTurno: z.number("El costo del turno debe ser un número").nonnegative("El costo del turno no puede ser negativo").optional(),
    pacienteId: z.string("El id del paciente debe ser un UUID válido"),
});

export const filtrosTurnoSchema = z.object({
    pacienteId: objectIdSchema("paciente").optional(),
    estado: z.enum(EstadoTurnoEnum, { error: "El estado del turno no es válido" }).optional(),
    medicoId: objectIdSchema("medico").optional(),
    servicioId: objectIdSchema("servicio").optional(),
    sedeId: objectIdSchema("sede").optional(),
    fechaHora: z.object({
        inicio: z.coerce.date({ invalid_type_error: "Fecha de inicio inválida" }),
        fin: z.coerce.date({ invalid_type_error: "Fecha de fin inválida" })
    }).optional(),
    ordenPorCosto: z.enum(["asc", "desc"]).optional(),
    ordenPorFecha: z.enum(["asc", "desc"]).optional()
}).superRefine((filtros, ctx) => {
    if (filtros.fechaHora && filtros.fechaHora.inicio > filtros.fechaHora.fin) {
        ctx.addIssue({
            code: "custom",
            message: "La fecha de inicio no puede ser mayor a la fecha de fin",
            path: ["fechaHora"]
        });
    }
});

export const turnoBaseSchema = z.object({
    pacienteId: objectIdSchema("paciente").optional(),
    medicoId: objectIdSchema("medico"),
    sedeId: objectIdSchema("sede"),
    servicioId: objectIdSchema("servicio"),
    estado: z.enum(EstadoTurnoEnum, { error: "El estado del turno no es válido" }),
    fechaHora: z.coerce.date({ invalid_type_error: "Fecha inválida" }),
    costo: z.number("El costo del turno debe ser un número").nonnegative("El costo del turno no puede ser negativo").optional()
});

export const bodySolicitarCambioFechaSchema = z.object({
    nuevaFechaHora: z.coerce.date({ invalid_type_error: "La nueva fecha debe ser una fecha válida" }),
    usuarioId: z.string({ required_error: "El id del usuario es requerido" })
});

export const bodyResponderCambioFechaSchema = z.object({
    aceptado: z.boolean({ required_error: "Debe indicar si el cambio es aceptado o no" }),
    usuarioId: z.string({ required_error: "El id del usuario es requerido" })
});

export const bodyUpdateTurnoSchema = turnoBaseSchema.partial();