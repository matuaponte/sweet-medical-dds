import { z } from "zod";
import { objectIdSchema } from "./objectIdSchema.js";

export const crearPacienteSchema = z.object({
    idUsuario: objectIdSchema("usuario"),
    dni: z.number()
        .int("El DNI debe ser un número entero")
        .positive("El DNI debe ser un número positivo")
        .min(1000000, "El DNI debe tener al menos 7 digitos"),
    nombre: z.string()
        .min(1, "El nombre es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .trim(),
    obraSocial: objectIdSchema("obra social").optional().nullable(),
    plan: z.string()
        .min(1, "El plan debe ser válido")
        .optional()
        .nullable()
});

export const actualizarPacienteSchema = crearPacienteSchema.partial();

export const pacienteIdSchema = z.object({
    pacienteId: objectIdSchema("paciente")
});

export const turnoIdSchema = z.object({
    turnoId: objectIdSchema("paciente")
});