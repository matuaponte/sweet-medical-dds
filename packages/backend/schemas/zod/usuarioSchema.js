import { z } from "zod";

export const usuarioSchema = z.object({
  // Si elegimos un username alfanumérico:
  /* nombreUsuario: z.string()
    .min(4, { message: "El usuario debe tener al menos 4 caracteres" })
    .max(20, { message: "El usuario no puede superar los 20 caracteres" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Solo se permiten letras, números y guiones bajos" }), */

  // si usamos el correo como usuario
  nombreUsuario: z.string().email({ message: "Formato de email inválido" }),

  password: z
    .string()
    .min(8, { message: "La contraseña debe tener mínimo 8 caracteres" })
    // Acá aplicamos una expresión regular para asegurar la complejidad
    .regex(/(?=.*[A-Z])/, {
      message: "Debe contener al menos una letra mayúscula",
    })
    .regex(/(?=.*[a-z])/, {
      message: "Debe contener al menos una letra minúscula",
    })
    .regex(/(?=.*\d)/, { message: "Debe contener al menos un número" }),
});

export const usuarioIdSchema = z.object({
  idUsuario: z.string().min(1, "El id del usuario es requerido")
});