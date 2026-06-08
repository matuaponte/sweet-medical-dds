import cron from "node-cron";

export function iniciarGeneracionTurnosBatch(turnoService) {
    cron.schedule("* * * * *", async () => { //Esto se ejecutará cada minuto
        try {
            console.warn("Ejecutando batch de generación de turnos");
            await turnoService.generarTurnosDisponibles();
        } catch (error) {
            console.error("Error en batch de generación de turnos", error);
        }
    });
}