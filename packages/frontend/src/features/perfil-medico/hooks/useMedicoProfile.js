import { useState, useEffect } from 'react';
import { 
  getMiPerfilMedico,
  agregarServicio,
  eliminarServicio,
  agregarDisponibilidad,
  modificarDisponibilidad,
  eliminarDisponibilidad,
  agregarSede,
  eliminarSede,
  updateMedico
} from '../../../api/medico';

export const useGetMiPerfilMedico = () => {
  const [medico, setMedico] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarMedico = async () => {
      try {
        setCargando(true);
        setError(null);
        const datos = await getMiPerfilMedico();
        setMedico(datos);
      } catch (err) {
        setError(err);
      } finally {
        setCargando(false);
      }
    }
    cargarMedico();
  }, []);

  return { medico, cargando, error };
}

export default function useMedicoProfile(medicoInicial, triggerConfirm, setAlertConfig, showAlert) {
  const [medico, setMedico] = useState(medicoInicial);

  const actualizarEstado = (response) => {
    // Dependiendo de si la API devuelve el objeto envuelto en { status, data }
    const nuevoMedico = response.data || response;
    setMedico(nuevoMedico);
  };

  const handleError = (e, mensajeDefault) => {
    setAlertConfig({
      isOpen: true,
      title: 'Error',
      message: e.response?.data?.message || mensajeDefault,
      type: 'error'
    });
  };

  // --- MANEJADORES DE SERVICIOS ---
  const handleAgregarServicio = async (idServicioElegido) => {
    if (!idServicioElegido) return false;
    try {
      const resp = await agregarServicio(idServicioElegido);
      actualizarEstado(resp);
      return true;
    } catch (e) {
      handleError(e, "No se pudo agregar el servicio.");
      return false;
    }
  };

  const handleEliminarServicio = (idSrv) => {
    triggerConfirm(
      "Confirmar Eliminación de Servicio",
      "¿Estás seguro de que quieres eliminar este servicio? También se eliminarán los horarios semanales de atención asociados.",
      async () => {
        try {
          const resp = await eliminarServicio(idSrv);
          actualizarEstado(resp);
        } catch (e) {
          handleError(e, "No se pudo eliminar el servicio.");
        }
      }
    );
  };

  // --- MANEJADORES DE DISPONIBILIDAD (HORARIOS) ---
  const handleAgregarDisponibilidad = async (dispData, editingDispId) => {
    const { formDispDia, formDispSede, formDispSrv, formDispHoraInicio, formDispHoraFin } = dispData;

    const payload = {
      diaSemana: formDispDia,
      horaDesde: formDispHoraInicio,
      horaHasta: formDispHoraFin,
      sedeId: formDispSede,
      servicioId: formDispSrv
    };

    try {
      if (editingDispId) {
        const resp = await modificarDisponibilidad(payload);
        actualizarEstado(resp);
      } else {
        const resp = await agregarDisponibilidad(payload);
        actualizarEstado(resp);
      }
      return { success: true };
    } catch (e) {
      const errorMessage = e.response?.data?.message || "No se pudo guardar la disponibilidad.";
      return { success: false, error: errorMessage };
    }
  };

  const handleEliminarDisponibilidad = (idDisp, diaSemana) => {
    // Nota: El backend elimina por diaSemana. Necesitamos asegurarnos de pasar diaSemana.
    triggerConfirm(
      "Confirmar Eliminación de Horario",
      "¿Estás seguro de que quieres eliminar este horario de atención?",
      async () => {
        try {
          // Buscamos la disponibilidad si diaSemana no fue provisto
          let dia = diaSemana;
          if (!dia) {
             const dispObj = medico.disponibilidades.find(d => d.id === idDisp);
             if (dispObj) dia = dispObj.diaSemana;
          }
          if (dia) {
            const resp = await eliminarDisponibilidad(dia);
            actualizarEstado(resp);
          }
        } catch (e) {
          handleError(e, "No se pudo eliminar el horario.");
        }
      }
    );
  };

  // --- MANEJADORES DE SEDES ---
  const handleAsociarSede = async (sede) => {
    try {
      const resp = await agregarSede(sede.id);
      actualizarEstado(resp);
      if (showAlert) showAlert('La sede fue vinculada con éxito.', 'success');
    } catch (e) {
      handleError(e, "No se pudo asociar la sede.");
    }
  };

  const handleDesvincularSede = (idSede) => {
    triggerConfirm(
      "Confirmar Desvinculación de Sede",
      "¿Estás seguro de que quieres desvincular esta sede? Se eliminarán los horarios asociados a ella.",
      async () => {
        try {
          const resp = await eliminarSede(idSede);
          actualizarEstado(resp);
          if (showAlert) showAlert('La sede fue desvinculada con éxito.', 'success');
        } catch (e) {
          handleError(e, "No se pudo desvincular la sede.");
        }
      }
    );
  };

  const handleGuardarDatosPersonales = async (nuevosDatos) => {
    if (Number(nuevosDatos.honorario) <= 0) {
      setAlertConfig({
        isOpen: true,
        title: 'Honorario Inválido',
        message: 'El honorario base debe ser mayor a 0.',
        type: 'error'
      });
      return false;
    }
    try {
      const payload = {
        nombre: nuevosDatos.nombre,
        honorario: Number(nuevosDatos.honorario)
      };
      const resp = await updateMedico(payload);
      actualizarEstado(resp);
      if (showAlert) showAlert('Datos personales actualizados con éxito.', 'success');
      return true;
    } catch (e) {
      handleError(e, "No se pudieron actualizar los datos personales.");
      return false;
    }
  };

  return {
    medico,
    setMedico,
    handleAgregarServicio,
    handleEliminarServicio,
    handleAgregarDisponibilidad,
    handleEliminarDisponibilidad,
    handleAsociarSede,
    handleDesvincularSede,
    handleGuardarDatosPersonales
  };
}
