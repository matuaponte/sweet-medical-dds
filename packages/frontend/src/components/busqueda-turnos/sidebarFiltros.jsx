import React, { useState } from 'react';
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

    const filtros = {
        'medicoId': profesional.id,
        'estado': 'DISPONIBLE',
        'especialidadId': especialidad.id,
        'practicaId': practica.id,
        'sedeId': sede.id,
        'fechaHoraInicio': fechaDesde,
        'fechaHoraFin': fechaHasta
    }

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
                        value={profesional?.id ?? ""}
                        label="Profesional"
                        onChange={(e) => {
                            const proSeleccionado = medicos.find(
                                pro => pro.id === e.target.value
                            );

                            setProfesional(proSeleccionado);
                            nuevosFiltros();
                        }}
                    >
                        <MenuItem value="Todos">Todos</MenuItem>
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
                        value={especialidad?.id ?? ""}
                        label="Especialidad"
                        onChange={(e) => {
                            const espSeleccionada = especialidades.find(
                                esp => esp.id === e.target.value
                            );

                            setEspecialidad(espSeleccionada);
                            setPractica("");
                            nuevosFiltros();
                        }}
                    >
                        <MenuItem value="Todas">Todas</MenuItem>
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
                        value={practica}
                        label="Práctica"
                        onChange={(e) => {
                            setPractica(e.target.value);
                            nuevosFiltros();
                        }}
                    >
                        <MenuItem value="Todas">Todas</MenuItem>
                        {practicas
                            .filter((practica) => practica.especialidadPadre === especialidad?.id || practica.especialidadPadre === null)
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
                        value={sede}
                        label="Sede de atención"
                        onChange={(e) => {
                            setSede(e.target.value);
                            nuevosFiltros();
                        }}
                    >
                        <MenuItem value="Todas">Todas</MenuItem>
                        {sedes.map((sede) => (
                            <MenuItem key={sede.id} value={sede.nombre}>
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
                                nuevosFiltros();
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
                                if (fechaSeleccionada <= hoy) {
                                    alert("La fecha hasta no puede ser anterior a hoy.");
                                    return;
                                }
                                if (fechaDesde && e.target.value < fechaDesde) {
                                    alert("La fecha hasta no puede ser anterior a la fecha desde.");
                                    return;
                                }
                                setFechaHasta(e.target.value);
                                nuevosFiltros();
                            }}
                            fullWidth
                        />
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}