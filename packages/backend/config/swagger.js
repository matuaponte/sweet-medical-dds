import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sweet Medical API",
            version: "1.0.0",
            description: "API REST para la gestión de turnos médicos, pacientes, obras sociales, sedes, turnos, pacientes y médicos"
        },
        servers: [
            {
                url: `http://localhost:${process.env.SERVER_PORT || 8080}`,
                description: "Servidor local",
            },
        ],
        components: {
            securitySchemes: {
                // Dejamos documentado para la futura implementación de la entrega 4
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Autenticación JWT (no implementada actualmente)',
                },
            },
            schemas: {
                // Tipos "primitivos"
                ObjectId: {
                    type: "string",
                    pattern: '^[a-fA-F0-9]{24}$',
                    description: "Identificador único de Mongo",
                    example: "507f1f77bcf86cd799439011",
                },
                UUID: {
                    type: "string",
                    format: "uuid",
                    description: "Identificador único universal",
                    example: "550e8400-e29b-41d4-a716-446655440000",
                },
                TiempoHHMM: {
                    type: "string",
                    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
                    description: "Hora en formato 24hs (HH:mm)",
                    example: "00:52"
                },
                Pesos: {
                    type: "number",
                    minimum: 0,
                    description: "Valor monetario",
                    example: 350.00,
                },

                // Enums
                EstadoTurno: {
                    type: "string",
                    enum: ['DISPONIBLE', 'RESERVADO', 'CONFIRMADO', 'CANCELADO', 'REALIZADO', 'PENDIENTECAMBIO'],
                    description: "Estados posibles de un turno médico",
                },
                DiaSemana: {
                    type: "string",
                    enum: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"],
                    description: "Días de la semana",
                },
                NivelCobertura: {
                    type: "string",
                    enum: ["TOTAL", "PARCIAL", "NO_CUBIERTA"],
                    description: "Nivel de cobertura de una obra social",
                },
                // Request bodys
                CrearUsuarioBody: {
                    type: 'object',
                    properties: {
                        nombreUsuario: { type: 'string', minLength: 4, maxLength: 20, pattern: '^[a-zA-Z0-9_]+$' },
                        password: { type: 'string', minLength: 8 },
                    },
                    required: ['nombreUsuario', 'password'],
                },
                CrearPacienteBody: {
                    type: 'object',
                    properties: {
                        idUsuario: { $ref: '#/components/schemas/ObjectId' },
                        dni: { type: 'integer', minimum: 1000000 },
                        nombre: { type: 'string', minLength: 3 },
                        obraSocial: { $ref: '#/components/schemas/ObjectId' },
                        plan: { type: 'string' },
                    },
                    required: ['idUsuario', 'dni', 'nombre'],
                },
                ActualizarPacienteBody: {
                    type: 'object',
                    properties: {
                        idUsuario: { $ref: '#/components/schemas/ObjectId' },
                        dni: { type: 'integer', minimum: 1000000 },
                        nombre: { type: 'string', minLength: 3 },
                        obraSocial: { $ref: '#/components/schemas/ObjectId' },
                        plan: { type: 'string' },
                    },
                },
                CrearMedicoBody: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string', minLength: 1 },
                        usuarioId: { $ref: '#/components/schemas/ObjectId' },
                        matricula: { type: 'string', maxLength: 10 },
                        honorario: { type: 'number', minimum: 0 },
                    },
                    required: ['nombre', 'usuarioId', 'matricula'],
                },
                DefinirDisponibilidadBody: {
                    type: 'object',
                    properties: {
                        diaSemana: { $ref: '#/components/schemas/DiaSemana' },
                        horaDesde: { $ref: '#/components/schemas/TiempoHHMM' },
                        horaHasta: { $ref: '#/components/schemas/TiempoHHMM' },
                        servicioId: { $ref: '#/components/schemas/ObjectId' },
                        sedeId: { $ref: '#/components/schemas/ObjectId' },
                    },
                    required: ['diaSemana', 'horaDesde', 'horaHasta', 'servicioId', 'sedeId'],
                },
                EliminarDisponibilidadBody: {
                    type: 'object',
                    properties: {
                        diaSemana: { $ref: '#/components/schemas/DiaSemana' },
                    },
                    required: ['diaSemana'],
                },
                CrearSedeBody: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string', minLength: 3, maxLength: 50, pattern: '^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$' },
                        direccion: { type: 'string', minLength: 3, maxLength: 150, pattern: '^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,-]+$' },
                    },
                    required: ['nombre', 'direccion'],
                },
                CrearServicioBody: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string', minLength: 1 },
                        duracionEnMins: { type: 'integer', minimum: 1 },
                        costo: { type: 'number' },
                        codigo: { type: 'string', nullable: true },
                        especialidadPadreId: { type: 'string', nullable: true },
                    },
                    required: ['nombre', 'duracionEnMins', 'costo'],
                },
                CrearObraSocialBody: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string', minLength: 4, maxLength: 50, pattern: '^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$' },
                        planes: { type: 'array', items: { $ref: '#/components/schemas/CrearPlanBody' } },
                    },
                    required: ['nombre'],
                },
                CrearPlanBody: {
                    type: 'object',
                    properties: {
                        nombre: { type: "string", minLength: 1 },
                        coberturaEspecialidad: { type: "array", items: { $ref: "#/components/schemas/CoberturaEspecialidad"}},
                        coberturaPractica: { type: "array", items: { $ref: "#/components/schemas/CoberturaPractica"}},
                    },
                    required: ["nombre"],
                },
                CoberturaEspecialidad: {
                    type: 'object',
                    properties: {
                        especialidad: { $ref: '#/components/schemas/ObjectId' },
                        nivelCobertura: { $ref: '#/components/schemas/NivelCobertura' },
                        porcentajeCobertura: { type: 'number', minimum: 0, maximum: 100, nullable: true },
                    },
                    required: ['especialidad', 'nivelCobertura'],
                },
                CoberturaPractica: {
                    type: 'object',
                    properties: {
                        practica: { $ref: '#/components/schemas/ObjectId' },
                        nivelCobertura: { $ref: '#/components/schemas/NivelCobertura' },
                        porcentajeCobertura: { type: 'number', minimum: 0, maximum: 100, nullable: true },
                    },
                    required: ['practica', 'nivelCobertura'],
                },
                CrearTurnoBody: {
                    type: 'object',
                    properties: {
                        pacienteId: { $ref: '#/components/schemas/ObjectId' },
                        medicoId: { $ref: '#/components/schemas/ObjectId' },
                        sedeId: { $ref: '#/components/schemas/ObjectId' },
                        servicioId: { $ref: '#/components/schemas/ObjectId' },
                        estado: { $ref: '#/components/schemas/EstadoTurno' },
                        fechaHora: { type: 'string', format: 'date-time' },
                        costo: { type: 'number', minimum: 0 },
                    },
                    required: ['medicoId', 'sedeId', 'servicioId', 'estado', 'fechaHora'],
                },
                AsignarTurnoBody: {
                    type: 'object',
                    properties: {
                        costoTurno: { type: 'number', minimum: 0 },
                        pacienteId: { $ref: '#/components/schemas/ObjectId' },
                    },
                    required: ['costoTurno', 'pacienteId'],
                },
                CambiarEstadoTurnoBody: {
                    type: 'object',
                    properties: {
                        nuevoEstado: { $ref: '#/components/schemas/EstadoTurno' },
                        quien: { $ref: '#/components/schemas/ObjectId' },
                        motivo: { type: 'string' },
                    },
                    required: ['nuevoEstado', 'quien'],
                },
                SolicitarCambioFechaBody: {
                    type: 'object',
                    properties: {
                        nuevaFechaHora: { type: 'string', format: 'date-time' },
                        usuarioId: { type: 'string' },
                    },
                    required: ['nuevaFechaHora', 'usuarioId'],
                },
                ResponderCambioFechaBody: {
                    type: 'object',
                    properties: {
                        aceptado: { type: 'boolean' },
                        usuarioId: { type: 'string' },
                    },
                    required: ['aceptado', 'usuarioId'],
                },
                ActualizarTurnoBody: {
                    type: 'object',
                    properties: {
                        pacienteId: { $ref: '#/components/schemas/ObjectId' },
                        medicoId: { $ref: '#/components/schemas/ObjectId' },
                        sedeId: { $ref: '#/components/schemas/ObjectId' },
                        servicioId: { $ref: '#/components/schemas/ObjectId' },
                        estado: { $ref: '#/components/schemas/EstadoTurno' },
                        fechaHora: { type: 'string', format: 'date-time' },
                        costo: { type: 'number', minimum: 0 }
                    },
                },

                // Respuestas para reutilizar
                Paginacion: {
                    type: "object",
                    properties: {
                        numeroPagina: { type: "integer" },
                        limitePorPagina: { type: "integer" },
                        totalPaginas: { type: "integer" },
                        totalTurnos: { type: "integer" },
                    },
                    required: ["numeroPagina", "limitePorPagina", "totalPaginas", "totalTurnos"]
                },
                
                // Documentar las entidades de dominio?
            },
            responses: {
                E400: {
                    description: "Error de validación de datos (zod)",
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                status: { type: 'string', example: 'fail' },
                                message: { type: 'string', example: 'Error de validación de datos' },
                                errors: {
                                    type: 'array',
                                    items: {
                                    type: 'object',
                                    properties: {
                                        campo: { type: 'string' },
                                        mensaje: { type: 'string' },
                                    },
                                    },
                                },
                                timestamp: { type: 'string', format: 'date-time' },
                                },
                            },
                        }
                    }
                },
                E404: {
                    description: "Recurso no encontrado",
                    content: {
                        'application/json': {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "string", example: "error" },
                                    message: { type: "string", example: "No se encontró un usuario con ese ID"},
                                    timestamp: { type: "string", format: "date-time" },
                                }
                            }
                        }
                    }
                },
                E500: {
                    description: "Error interno del servidor",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "string", example: "error" },
                                    message: { type: "string", example: "Error interno del servidor"},
                                    timestamp: { type: "string", format: "date-time" },
                                }
                            }
                        }
                    }
                },
                EExample: {
                    description: "Ejemplo de respuesta de error con datos de prueba",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "string", example: "error" },
                                    message: { type: "string", example: "Médico no encontrado con ese ID"},
                                    timestamp: { type: "string", example: "26-06-2011T14:30:00.000Z" },
                                }
                            }
                        }
                    }
                }
            },
        }
    },
    apis: [
        // Documentamos cada una de las rutas
        "./routes/*.js"
        // Documenetamos los schemas?
    ]
}

export const specs = swaggerJSDoc(options);