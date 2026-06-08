import { z } from "zod";
import { NivelCobertura } from "../../domain/coberturas/nivelCoberturaEnum.js";

const MIN_NOMBRE_OBRA_SOCIAL = 4;
const MAX_NOMBRE_OBRA_SOCIAL = 50;
const MONGO_OBJECT_ID_REGEX = /^[a-fA-F0-9]{24}$/;

/** @type {z.ZodSchema} */

export const obraSocialIdParamSchema = z.object({
  obraSocialId: z.string()
    .regex(MONGO_OBJECT_ID_REGEX, "El ID de la obra social debe ser un ObjectId válido")
});

export const planIdParamSchema = z.object({
  planId: z.union([
    z.string().uuid({ error: "El ID del plan debe ser un ID válido" }),
    z.string().regex(MONGO_OBJECT_ID_REGEX, "El ID del plan debe ser un ObjectId válido")
  ])
});

export const nombreObraSocialSchema = z.string({
    required_error: "El nombre de la obra social es obligatorio",
    invalid_type_error: "El nombre de la sede debe ser una cadena de texto"
}).min(MIN_NOMBRE_OBRA_SOCIAL, `El nombre debe tener al menos ${MIN_NOMBRE_OBRA_SOCIAL} caracteres`)
  .max(MAX_NOMBRE_OBRA_SOCIAL, `El nombre debe tener como máximo ${MAX_NOMBRE_OBRA_SOCIAL} caracteres`)
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/, "El nombre solo puede contener letras, números y espacios");

const coberturaEspecialidadSchema = z.object({
  especialidad: z.string()
    .min(1, "El id de la especialidad es obligatorio")
    .refine((id) => {
        // Valida que sea un ObjectId válido (formato)
        return /^[a-f0-9]{24}$|^[0-9a-f]{24}$/.test(id);
    }, "El ID debe ser un ObjectId válido"),
  nivel: z.enum(NivelCobertura, { error: "Nivel de cobertura inválido" }),
  porcentajeCobertura: z.number().min(0, "El porcentaje debe ser >= 0").max(1, "El porcentaje debe ser <= 1"),
});

const coberturaPracticaSchema = z.object({
  practica: z.string()
    .min(1, "El id de la especialidad es obligatorio")
    .refine((id) => {
        // Valida que sea un ObjectId válido (formato)
        return /^[a-f0-9]{24}$|^[0-9a-f]{24}$/.test(id);
    }, "El ID debe ser un ObjectId válido"),
  nivel: z.enum(NivelCobertura, { error: "Nivel de cobertura inválido" }),
  porcentajeCobertura: z.number().min(0, "El porcentaje debe ser >= 0").max(1, "El porcentaje debe ser <= 1"),
});

export const crearPlanObraSocialSchema = z.object({
  nombre: z.string().min(1, "El nombre del plan es obligatorio"),
  coberturaEspecialidad: z.array(coberturaEspecialidadSchema).optional().default([]),
  coberturaPractica: z.array(coberturaPracticaSchema).optional().default([])
});

export const actualizarPlanObraSocialSchema = crearPlanObraSocialSchema.partial();

export const crearObraSocialSchema = z.object({
  nombre: nombreObraSocialSchema,
  planes: z.array(crearPlanObraSocialSchema).optional().default([])
});

export const actualizarObraSocialSchema = crearObraSocialSchema.partial();
