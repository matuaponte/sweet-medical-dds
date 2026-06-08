import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL

export const getPacienteByIdUsuario = async (idUsuario) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pacientes/${idUsuario}`);
        return response.data;
    } catch (e) {
        console.error("Error obteniendo el id del paciente con id de usuario: " + idUsuario);
        throw e;
    }
}

export const getTurnosDisponiblesFiltradoPaginado = async (filtros, paginacion) => {
    try {
        const params = Object.fromEntries(
            Object.entries({ ...filtros, ...paginacion })
                .filter(([_, v]) => v !== null && v !== undefined && v !== "")
        );

        const response = await axios.get(`${API_BASE_URL}/turnos`, { params });
        return response.data;
    } catch (e) {
        console.error("Error obteniendo los turnos");
        throw e;
    }
}

export const getListadoMedicos = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/medicos`);
        return response.data;
    } catch (e) {
        console.error("Error obteniendo los medicos");
        throw e;
    }
}

export const getListadoServicios = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/servicios`);
        return response.data;
    } catch (e) {
        console.error("Error obteniendo las especialidades");
        throw e;
    }
}

export const getListadoSedes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sedes`);
        return response.data;
    } catch (e) {
        console.error("Error obteniendo las sedes");
        throw e;
    }
}

export const reservarTurno = async (turnoId, pacienteId, costo) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/turnos/${turnoId}`, {
            body: {
                'pacienteId': pacienteId,
                'costo': costo
            }
        });
        return response.data;
    } catch (e) {
        console.error("Error reservando el turno de id: " + turnoId);
        throw e;
    }
}