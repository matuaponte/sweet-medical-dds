import express from "express"; // framework para crear el servidor y manejar las rutas
import { Server } from "./server.js";
import routes from "./routes/router.js";

import { ServicioController } from "./controllers/ServicioController.js";
import { NotificacionController } from "./controllers/NotificacionController.js";
import { TurnoController } from "./controllers/TurnoController.js";
import { ObraSocialController } from "./controllers/ObraSocialController.js";
import { UsuarioController } from "./controllers/UsuarioController.js";
import { MedicoController } from "./controllers/MedicoController.js";
import { TurnoService } from "./services/TurnoService.js";
import { iniciarGeneracionTurnosBatch } from "./schedulers/generacionTurnos.js";
import { SedeController } from "./controllers/SedeController.js";
import { PacienteController } from "./controllers/PacienteController.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = new Server(app);

server.setController(
    PacienteController,
    new PacienteController()
);

server.setController(
    ServicioController,
    new ServicioController()
);

server.setController(
    NotificacionController,
    new NotificacionController()
);

server.setController(
    UsuarioController,
    new UsuarioController()
);

server.setController(
    MedicoController,
    new MedicoController()
);

server.setController(
    SedeController,
    new SedeController()
);

const turnoController = new TurnoController();
server.setController(TurnoController, turnoController);

const obraSocialController = new ObraSocialController();
server.setController(ObraSocialController, obraSocialController);

const usuarioController = new UsuarioController();
server.setController(UsuarioController, usuarioController);

const medicoController = new MedicoController();
server.setController(MedicoController, medicoController);

const turnoService = new TurnoService();

iniciarGeneracionTurnosBatch(turnoService);

/* -------------------------------------------------------------------------- */
/*                                    RUTAS                                   */
/* -------------------------------------------------------------------------- */
routes.forEach((ruta) => server.addRoute(ruta));
server.configurarRutas();



export default server;
