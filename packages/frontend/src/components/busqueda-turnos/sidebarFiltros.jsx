import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
    Box,
    Button,
    Card,
    Typography,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Stack
} from '@mui/material';


export default function SidebarFiltros({ medicos, sedes, especialidades, practicas, nuevosFiltros }) {
    // Estados para controlar los filtros (puedes pasarlos como props más adelante)
    const [profesional, setProfesional] = useState('Todos');
    const [especialidad, setEspecialidad] = useState('Todas');
    const [practica, setPractica] = useState('Todas');
    const [sede, setSede] = useState('Todas');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const aplicarFiltros = (overrides = {}) => {
        const estado = {
            profesional, especialidad, practica, sede, fechaDesde, fechaHasta,
            ...overrides  // pisa con los valores nuevos
        };

        let servicio = null;
        if (estado.especialidad !== 'Todas') {
            servicio = estado.practica !== 'Todas' ? estado.practica : estado.especialidad;
        }

        const filtrosActuales = {
            medicoId: estado.profesional !== 'Todos' ? estado.profesional?.id : null,
            servicioId: servicio?.id ?? null,
            sedeId: estado.sede !== 'Todas' ? estado.sede?.id : null,
            fechaHoraInicio: estado.fechaDesde || null,
            fechaHoraFin: estado.fechaHasta || null
        };

        console.log("aplicando nuevos filtros: " + JSON.stringify(filtrosActuales));
        nuevosFiltros(filtrosActuales);
    };

    return (
        <Box
            component="aside"
            sx={{
                width: 280,
                backgroundColor: '#ffffff',
                borderRadius: 3,
                padding: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.01)'
            }}
        >
            {/* Título de la sección */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <FilterAltIcon sx={{ color: '#475569', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                    Búsqueda de Turnos
                </Typography>
            </Stack>

            {/* Contenedor vertical de los formularios */}
            <Stack spacing={2.5}>

                {/* Profesional */}
                <FormControl fullWidth size="small">
                    <InputLabel id="profesional-label">Profesional</InputLabel>
                    <Select
                        labelId="profesional-label"
                        value={profesional?.id ?? 'Todos'}
                        label="Profesional"
                        onChange={(e) => {
                            const profesionalSeleccionado = e.target.value === 'Todos' ? 'Todos' : medicos.find(
                                pro => pro.id === e.target.value
                            );

                            setProfesional(profesionalSeleccionado);
                            setEspecialidad('Todas');
                            setPractica('Todas');
                            aplicarFiltros({ profesional: profesionalSeleccionado, especialidad: 'Todas', practica: 'Todas' });
                        }}
                    >
                        <MenuItem value='Todos'>Todos</MenuItem>
                        {medicos.map((pro) => (
                            <MenuItem key={pro.id} value={pro.id}>
                                {pro.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Especialidad */}
                <FormControl fullWidth size="small">
                    <InputLabel id="especialidad-label">Especialidad</InputLabel>
                    <Select
                        labelId="especialidad-label"
                        value={especialidad?.id ?? 'Todas'}
                        label="Especialidad"
                        onChange={(e) => {
                            const especialidadSeleccionada = e.target.value === 'Todas' ? 'Todas' : especialidades.find(
                                esp => esp.id === e.target.value
                            );

                            setEspecialidad(especialidadSeleccionada);
                            setPractica('Todas');
                            aplicarFiltros({ especialidad: especialidadSeleccionada, practica: 'Todas' });
                        }}
                    >
                        <MenuItem value='Todas'>Todas</MenuItem>
                        {especialidades.map((esp) => (
                            <MenuItem key={esp.id} value={esp.id}>
                                {esp.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Práctica */}
                <FormControl fullWidth size="small">
                    <InputLabel id="practica-label">Práctica</InputLabel>
                    <Select
                        labelId="practica-label"
                        value={practica?.id ?? 'Todas'}
                        label="Práctica"
                        onChange={(e) => {
                            const practicaSeleccionada = e.target.value === 'Todas' ? 'Todas' : practicas.find(
                                pra => pra.id === e.target.value
                            );

                            setPractica(practicaSeleccionada);
                            aplicarFiltros({ practica: practicaSeleccionada });
                        }}
                    >
                        <MenuItem value='Todas'>Todas</MenuItem>
                        {practicas
                            .filter((practica) => practica.especialidadPadreId === especialidad?.id || practica.especialidadPadre === null)
                            .map((practica) => (
                                <MenuItem key={practica.id} value={practica.id}>
                                    {practica.nombre}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                {/* Sede de atención */}
                <FormControl fullWidth size="small">
                    <InputLabel id="sede-label">Sede de atención</InputLabel>
                    <Select
                        labelId="sede-label"
                        value={sede?.id ?? "Todas"}
                        label="Sede de atención"
                        onChange={(e) => {
                            const sedeSeleccionada = e.target.value === 'Todas' ? 'Todas' : sedes.find(
                                    sede => sede.id === e.target.value
                            )

                            setSede(sedeSeleccionada);
                            aplicarFiltros({ sede: sedeSeleccionada });
                        }}
                    >
                        <MenuItem value="Todas">Todas</MenuItem>
                        {sedes.map((sede) => (
                            <MenuItem key={sede.id} value={sede.id}>
                                {sede.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Rango de Fechas */}
                <Box>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 1, color: '#1e293b' }}>
                        Rango de Fechas
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            size="small"
                            type="date"
                            //label="Desde"
                            //InputLabelProps={{ shrink: true }}
                            helperText="Desde"
                            value={fechaDesde}
                            onChange={(e) => {
                                const fechaSeleccionada = new Date(e.target.value);
                                const hoy = new Date().setHours(0, 0, 0, 0);
                                if (fechaSeleccionada < hoy) {
                                    alert("La fecha desde no puede ser anterior a hoy.");
                                    return;
                                }
                                if (fechaHasta && e.target.value > fechaHasta) {
                                    alert("La fecha desde no puede ser posterior a la fecha hasta.");
                                    return;
                                }
                                setFechaDesde(e.target.value);
                                aplicarFiltros({ fechaDesde: fechaSeleccionada });
                            }}
                            fullWidth
                        />
                        <TextField
                            size="small"
                            type="date"
                            //label="Hasta"
                            //InputLabelProps={{ shrink: true }}
                            helperText="Hasta"
                            value={fechaHasta}
                            onChange={(e) => {
                                const fechaSeleccionada = new Date(e.target.value);
                                const hoy = new Date().setHours(0, 0, 0, 0);
                                if (fechaSeleccionada < hoy) {
                                    alert("La fecha hasta no puede ser anterior a hoy.");
                                    return;
                                }
                                if (fechaDesde && e.target.value < fechaDesde) {
                                    alert("La fecha hasta no puede ser anterior a la fecha desde.");
                                    return;
                                }
                                setFechaHasta(e.target.value);
                                aplicarFiltros({ fechaHasta: fechaSeleccionada });
                            }}
                            fullWidth
                        />
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}