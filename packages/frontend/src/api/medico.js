import axiosInstance from "./axiosInstance";

export const getMiPerfilMedico= async () => {
    try {
        const response = await axiosInstance.get(`/medicos/me`);
        return response.data;
    } catch (e) {
        if (e.response?.status === 404) {
            return null; // usuario sin medico
        }
        console.error("Error obteniendo el perfil médico", e);
        throw e;
    }
}

export const getMedicoById = async (id) => {
    try {
        const response = await axiosInstance.get(`/medicos/${id}`);
        console.log(response.data);
        return response.data;
    } catch (e) {
        if (e.response?.status === 404) {
            return null; // id de medico no encontrado
        }
        console.error("Error obteniendo el medico con id: " + id, e);
        throw e;
    }
}

export const getListadoMedicos = async () => {
    try {
        const response = await axiosInstance.get('/medicos');
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.error("Error obteniendo los medicos");
        throw e;
    }
}

// --- SERVICIOS ---
export const agregarServicio = async ( idServicio) => {
    try {
        const response = await axiosInstance.post(`/medicos/me/servicios/${idServicio}`);
        return response.data;
    } catch (e) {
        console.error("Error agregando servicio:", e);
        throw e;
    }
}

export const eliminarServicio = async ( idServicio) => {
    try {
        const response = await axiosInstance.delete(`/medicos/me/servicios/${idServicio}`);
        return response.data;
    } catch (e) {
        console.error("Error eliminando servicio:", e);
        throw e;
    }
}

// --- SEDES ---
export const agregarSede = async ( idSede) => {
    try {
        const response = await axiosInstance.post(`/medicos/me/sedes/${idSede}`);
        return response.data;
    } catch (e) {
        console.error("Error agregando sede:", e);
        throw e;
    }
}

export const eliminarSede = async ( idSede) => {
    try {
        const response = await axiosInstance.delete(`/medicos/me/sedes/${idSede}`);
        return response.data;
    } catch (e) {
        console.error("Error eliminando sede:", e);
        throw e;
    }
}

// --- DISPONIBILIDADES ---
export const agregarDisponibilidad = async ( disponibilidadData) => {
    try {
        const response = await axiosInstance.post(`/medicos/me/disponibilidades`, disponibilidadData);
        return response.data;
    } catch (e) {
        console.error("Error agregando disponibilidad:", e);
        throw e;
    }
}

export const modificarDisponibilidad = async ( disponibilidadData) => {
    try {
        const response = await axiosInstance.put(`/medicos/me/disponibilidades`, disponibilidadData);
        return response.data;
    } catch (e) {
        console.error("Error modificando disponibilidad:", e);
        throw e;
    }
}

export const eliminarDisponibilidad = async ( diaSemana) => {
    try {
        const response = await axiosInstance.delete(`/medicos/me/disponibilidades`, { data: { diaSemana } });
        return response.data;
    } catch (e) {
        console.error("Error eliminando disponibilidad:", e);
        throw e;
    }
}

export const updateMedico = async ( medicoData) => {
    try {
        const response = await axiosInstance.put(`/medicos/me`, medicoData);
        return response.data;
    } catch (e) {
        console.error("Error actualizando medico:", e);
        throw e;
    }
}
