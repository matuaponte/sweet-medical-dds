import express from "express";
import { NotificacionController } from "../controllers/NotificacionController.js";
/**
 * 
 * @swagger
 * components:
 *  schemas:
 *      Notificacion:
 *          type: object
 *          properties:
 *              _id: { $ref: '#/components/schemas/ObjectId' }
 *              destinatarioId: { $ref: '#/components/schemas/ObjectId' }
 *              remitenteId: { $ref: '#/components/schemas/ObjectId' }
 *              mensaje: { type: string, minLength: 15 }
 *              fechaHoraCreacion: { type: string, format: date-time }
 *              fechaHoraLeida: { type: string, format: date-time, nullable: true }
 *              leida: { type: boolean }
 *          required: [destinatarioId, remitenteId, mensaje]
 */

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Notificaciones de usuarios
 */
export default function notificacionRoutes(getController) {
    const router = express.Router({ mergeParams: true });
    const notificacionController = getController(NotificacionController);

    /**
     * @swagger
     * /usuarios/{idUsuario}/notificaciones/leidas:
     *   get:
     *     summary: Obtener notificaciones leídas
     *     tags: [Notificaciones]
     *     parameters:
     *       - in: path
     *         name: idUsuario
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Notificaciones leídas
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Notificacion'
     *       400:
     *         $ref: '#/components/responses/E400'
     *       500:
     *         $ref: '#/components/responses/E500'
     */
    router.route("/leidas").get((req, res, next) => notificacionController.getLeidas(req, res, next));
    //router.route("/leidas-paginadas").get((req, res, next) => notificacionController.getLeidasPaginadas(req, res, next));
    
    /**
     * @swagger
     * /usuarios/{idUsuario}/notificaciones/no-leidas:
     *   get:
     *     summary: Obtener notificaciones no leídas
     *     tags: [Notificaciones]
     *     parameters:
     *       - in: path
     *         name: idUsuario
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Notificaciones no leídas
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Notificacion'
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    router.route("/no-leidas").get((req, res, next) => notificacionController.getNoLeidas(req, res, next));
    //router.route("/no-leidas-paginadas").get((req, res, next) => notificacionController.getNoLeidasPaginadas(req, res, next));
    
    /**
     * @swagger
     * /usuarios/{idUsuario}/notificaciones/{idNotificacion}/leer:
     *   patch:
     *     summary: Marcar notificación como leída
     *     tags: [Notificaciones]
     *     parameters:
     *       - in: path
     *         name: idUsuario
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *       - in: path
     *         name: idNotificacion
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/ObjectId'
     *     responses:
     *       200:
     *         description: Notificación marcada como leída
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   $ref: '#/components/schemas/Notificacion'
     *                 message: { type: string, example: "Notificación leída exitosamente." }
     *       400:
     *         $ref: '#/components/responses/E400'
     */
    router.route("/:idNotificacion/leer").patch((req, res, next) => notificacionController.leer(req, res, next));

    return router;
}