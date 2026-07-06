import { z } from "zod";

export const urlSchema = z.object({
  url: z.string().url(),
});

// Esquema para validar un ID numérico en los parámetros de la URL
export const idParamNumberSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number).refine(n => n > 0, {
    message: "El id debe ser un número positivo"
  })
});

export const idParamUUIDSchema = z.object({
  id: z.string().uuid("El id debe ser un UUID válido")
});

export const idParamObjectIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/).refine(id => {
    // Verificar que el ID tenga exactamente 24 caracteres hexadecimales
    return /^[0-9a-fA-F]{24}$/.test(id);
  }, {
    message: "El id debe ser un ObjectId de MongoDB válido"
  })
});