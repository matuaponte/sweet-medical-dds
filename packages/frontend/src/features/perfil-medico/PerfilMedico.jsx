import React, { useState } from 'react';
import {useAlert} from '../../context/AlertContext.jsx';

// Hooks
import useMedicoProfile from './hooks/useMedicoProfile.js';
import useTurnos from './hooks/useTurnos';
import { useGetMiPerfilMedico } from './hooks/useMedicoProfile.js';

// Componentes 
import CabeceraPerfil from '../../components/medico/CabeceraPerfil';
import ServiciosTab from '../../components/medico/ServiciosTab';
import DisponibilidadesTab from '../../components/medico/DisponibilidadesTab';
import SedesTab from '../../components/medico/SedesTab';
import TurnosTab from '../../components/medico/TurnosTab';
import PerfilMedicoSkeleton from './components/PerfilMedicoSkeleton';
import PerfilEmptyState from './components/PerfilEmptyState';

// Modales
import ModalAgregarServicio from './modals/ModalAgregarServicio';
import ModalDisponibilidad from './modals/ModalDisponibilidad';
import ModalConfirmacion from './modals/ModalConfirmacion';
import ModalAlerta from './modals/ModalAlerta';

// Estilos
import './PerfilMedico.css';

export default function PerfilMedico() {
  const { medico: medicoInicial, cargando, error } = useGetMiPerfilMedico();

  if (cargando) return <PerfilMedicoSkeleton />;

  if (error) {
    return (
      <main className="container-perfil">
        <PerfilEmptyState
          titulo="Error al cargar el perfil"
          descripcion="Ocurrió un problema al obtener tu perfil médico. Intentá nuevamente."
          textoBoton="Reintentar"
          onClick={() => window.location.reload()}
        />
      </main>
    );
  }

  if (!medicoInicial) {  
    return (
      <main className="container-perfil">
        <PerfilEmptyState
          titulo="Perfil no encontrado"
          descripcion="No se encontró un perfil médico asociado a tu cuenta."
          textoBoton="Volver al inicio"
          onClick={() => window.location.href = '/'}
        />
      </main>
    );
  }

  return <PerfilMedicoContent medicoInicial={medicoInicial} />;
}

function PerfilMedicoContent({ medicoInicial }) {
  const [activeTab, setActiveTab] = useState('servicios');
  const [modalOpen, setModalOpen] = useState(null);
  const { showAlert } = useAlert();

  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const triggerConfirm = (title, message, onConfirmAction) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirmAction();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showAlert("Acción confirmada", "success");
      }
    });
  };

  const {
    medico,
    handleAgregarServicio,
    handleEliminarServicio,
    handleAgregarDisponibilidad,
    handleEliminarDisponibilidad,
    handleAsociarSede,
    handleDesvincularSede,
    handleGuardarDatosPersonales
  } = useMedicoProfile(medicoInicial, triggerConfirm, setAlertConfig, showAlert);

  const turnosHook = useTurnos(medico, activeTab);

  const [editingDispId, setEditingDispId] = useState(null);
  const [dispInitialData, setDispInitialData] = useState(null);



  const handleEditDisponibilidad = (disp) => {
    setEditingDispId(disp.id);
    setDispInitialData(disp);
    setModalOpen('disponibilidad');
  };

  const handleOpenDispModalNew = () => {
    setEditingDispId(null);
    setDispInitialData(null);
    setModalOpen('disponibilidad');
  };

  return (
    <main className="container-perfil">
      <div className="row">
        <div className="col-12">
          
          <CabeceraPerfil
            medico={medico}
            handleGuardarDatosPersonales={handleGuardarDatosPersonales}
            setAlertConfig={setAlertConfig}
          />

          <section className="perfil-card p-0 overflow-hidden mb-4">
            <nav className="tabs-header-container">
              {['servicios', 'disponibilidades', 'sedes', 'turnos'].map(tab => {
                const label = tab === 'servicios' ? 'Mis Servicios'
                  : tab === 'disponibilidades' ? 'Mis Horarios'
                    : tab === 'sedes' ? 'Mis Sedes'
                      : 'Mis Turnos';
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab-nav-btn ${activeTab === tab ? 'active' : ''}`}
                  >
                    {label}
                  </button>
                );
              })}
            </nav>

            <article className="tab-content-container p-4">
              {activeTab === 'servicios' && (
                <ServiciosTab
                  especialidades={medico?.especialidades || []}
                  practicas={medico?.practicas || []}
                  onAdd={() => setModalOpen('servicio')}
                  onEliminar={handleEliminarServicio}
                />
              )}

              {activeTab === 'disponibilidades' && (
                <DisponibilidadesTab
                  disponibilidades={medico?.disponibilidades || []}
                  onAdd={handleOpenDispModalNew}
                  onEdit={handleEditDisponibilidad}
                  onEliminar={handleEliminarDisponibilidad}
                />
              )}

              {activeTab === 'sedes' && (
                <SedesTab
                  sedesAsignadas={medico?.sedes || []}
                  onAsociar={handleAsociarSede}
                  onDesvincular={handleDesvincularSede}
                />
              )}

              {activeTab === 'turnos' && (
                <TurnosTab
                  medico={medico}
                  turnos={turnosHook.turnosFiltrados}
                  subTab={turnosHook.turnosSubTab}
                  setSubTab={turnosHook.setTurnosSubTab}
                  loading={turnosHook.loadingTurnos}
                  isFetching={turnosHook.isFetching}
                  page={turnosHook.turnosPage}
                  totalPages={turnosHook.totalTurnosPaginas}
                  totalItems={turnosHook.totalTurnosCount}
                  counts={turnosHook.counts}
                  onPageChange={turnosHook.setTurnosPage}
                  onActualizarEstado={turnosHook.handleActualizarEstadoTurno}
                  onProponerCambio={turnosHook.handleProponerCambioTurno}
                  onObtenerHistorialPaciente={turnosHook.handleObtenerHistorialPaciente}
                />
              )}
            </article>
          </section>
        </div>
      </div>

      <ModalAgregarServicio
        isOpen={modalOpen === 'servicio'}
        onClose={() => setModalOpen(null)}
        medico={medico}
        handleAgregarServicio={handleAgregarServicio}
      />

      <ModalDisponibilidad
        isOpen={modalOpen === 'disponibilidad'}
        onClose={() => setModalOpen(null)}
        medico={medico}
        handleAgregarDisponibilidad={handleAgregarDisponibilidad}
        initialData={dispInitialData}
        editingDispId={editingDispId}
      />

      <ModalConfirmacion
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
      />

      <ModalAlerta
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />

    </main>
  );
}
