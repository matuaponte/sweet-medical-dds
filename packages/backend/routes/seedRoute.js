import express from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";
import { MedicoController } from "../controllers/MedicoController.js";
import { ServicioController } from "../controllers/ServicioController.js";
import { NotificacionController } from "../controllers/NotificacionController.js";

/**
 * @swagger
 * /seed:
 *   get:
 *     summary: Ejecutar seed global
 *     tags: [Seed]
 *     responses:
 *       200:
 *         description: Seed ejecutado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Seed ejecutado correctamente"
 *                 resultados:
 *                   type: object
 *                   properties:
 *                     usuarios: { type: array }
 *                     medicos: { type: array }
 *                     notificaciones: { type: array }
 *                     servicios: { type: array }
 *       500:
 *         $ref: '#/components/responses/E500'
 */
export default function seedRoute(getController) {
    const router = express.Router();

    const usuarioController = getController(UsuarioController);
    const medicoController = getController(MedicoController);
    const servicioController = getController(ServicioController);
    const notificacionController = getController(NotificacionController);

    router.get("/", async (req, res, next) => {
        try {
            const usuarios = await usuarioController.seed();
            const medicos = await medicoController.seed(usuarios);
            const notificaciones = await notificacionController.seed(usuarios);
            const servicios = await servicioController.seed();

            res.json({
                mensaje: "Seed ejecutado correctamente",
                resultados: {
                    usuarios,
                    medicos,
                    notificaciones,
                    servicios
                }
            });
        } catch (error) {
            next(error);
        }
    });
    return router;
}