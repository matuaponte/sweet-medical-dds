import cron from "node-cron";

export function generarNotificacionesParaTurnos(turnoService) {
    cron.schedule("0 0 * * *", async () => { //todos los dias a las 00:00
        try {
            console.warn("[NOTIFICACIONES TURNO SCHEDULE]: Generando notificaciones para turnos");
            await turnoService.generarNotificacionesDeTurnosProximos();
        } catch (error) {
            console.error("[NOTIFICACIONES TURNO SCHEDULE]: Error de generación notificaciones de turnos", error);
        }
    });
}