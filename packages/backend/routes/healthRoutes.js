import express from "express";

/**
 * 
 * @swagger
 *  /health:
 *      get:
 *          summary: Verificar estado del servicio
 *          tags: [Health]
 *          responses:
 *              200:
 *                  description: Servicio funcionando correctamente
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status: { type: string, example "ok" }
 *                                  message: { type: string, example: "El servicio está funcionando correctamente"}
 */
export default function healthRoutes(_getController) {
    const router = express.Router();
    router.get("", (req, res) => {
        res.status(200).json({
            status: "ok",
            message: "El servicio está funcionando correctamente",
        });
    });
    return router;
}