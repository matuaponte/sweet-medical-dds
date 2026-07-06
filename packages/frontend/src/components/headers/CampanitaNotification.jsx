import React, { useState } from "react";
import {
  Tooltip,
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  List,
  Divider,
  Skeleton,
} from '@mui/material';
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import { useNotificaciones } from "../../context/NotificacionContext";
import { useNavigate } from "react-router-dom";
import ItemNotificacion from "./ItemNotificacion";

export default function CampanitaNotification() {
  const navigate = useNavigate();
  const {
    notificacionesLeidas,
    notificacionesNoLeidas,
    cargando,
    cantidadNoLeidas,
    cantidadLeidas,
    hasMoreNoLeidas,
    hasMoreLeidas,
    marcarComoLeida,
    marcarComoNoLeida,
    marcarTodasComoLeidas,
    cargarMasNoLeidas,
    cargarMasLeidas
  } = useNotificaciones();

  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-describedby={id}
          className="notification-btn"
          sx={{ color: 'primary.main' }}
        >
          <Badge
            color="error"
            badgeContent={cantidadNoLeidas}
            invisible={cantidadNoLeidas === 0}
            sx={{
              '& .MuiBadge-badge': {
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '10px',
              },
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 480,
              maxHeight: 500,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Encabezado */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            pb: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Notificaciones
          </Typography>
          {cantidadNoLeidas > 0 && (
            <Button
              size="small"
              onClick={marcarTodasComoLeidas}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              Marcar todo leído
            </Button>
          )}
        </Box>

        {/* Pestañas */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="notificaciones tabs"
          >
            <Tab
              label={cantidadNoLeidas > 0 ? `Sin leer (${cantidadNoLeidas})` : 'Sin leer'}
              id="tab-no-leidas"
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            />
            <Tab
              label="Leídas"
              id="tab-leidas"
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            />
          </Tabs>
        </Box>

        {/* Contenido / Listado */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 180, display: 'flex', flexDirection: 'column', width: '100%', px: 1, scrollbarGutter: 'stable' }}>
          {cargando && (
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ width: '100%' }}>
                  <Skeleton variant="text" width="85%" height={20} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Skeleton variant="text" width="45%" height={14} />
                    <Skeleton variant="text" width="25%" height={14} />
                  </Box>
                  {i < 3 && <Divider sx={{ mt: 1.5 }} />}
                </Box>
              ))}
            </Box>
          )}

          {!cargando && tabValue === 0 && (
            <>
              {notificacionesNoLeidas.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    p: 4,
                    textAlign: 'center',
                    width: '100%',
                    minHeight: 180,
                  }}
                >
                  <NotificationsOffIcon
                    sx={{ fontSize: 40, color: 'text.secondary', mb: 1, opacity: 0.6 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No tienes notificaciones pendientes.
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {notificacionesNoLeidas.map((n, index) => (
                    <React.Fragment key={n.id || index}>
                      <ItemNotificacion
                        notificacion={n}
                        onMarcarLeida={marcarComoLeida}
                        onMarcarNoLeida={marcarComoNoLeida}
                        pantallaCompleta={false}
                      />
                      {index < notificacionesNoLeidas.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
              {hasMoreNoLeidas && (
                <Box
                  display="flex"
                  justifyContent="center"
                  p={1.5}
                  borderTop={1}
                  borderColor="divider"
                >
                  <Button
                    size="small"
                    onClick={cargarMasNoLeidas}
                    disabled={cargando}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  >
                    {cargando ? 'Cargando...' : 'Cargar más'}
                  </Button>
                </Box>
              )}
            </>
          )}

          {!cargando && tabValue === 1 && (
            <>
              {notificacionesLeidas.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    p: 4,
                    textAlign: 'center',
                    width: '100%',
                    minHeight: 180,
                  }}
                >
                  <NotificationsOffIcon
                    sx={{ fontSize: 40, color: 'text.secondary', mb: 1, opacity: 0.6 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No tienes notificaciones leídas.
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {notificacionesLeidas.map((n, index) => (
                    <React.Fragment key={n.id || index}>
                      <ItemNotificacion
                        notificacion={n}
                        onMarcarLeida={marcarComoLeida}
                        onMarcarNoLeida={marcarComoNoLeida}
                        pantallaCompleta={false}
                      />
                      {index < notificacionesLeidas.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
              {hasMoreLeidas && (
                <Box
                  display="flex"
                  justifyContent="center"
                  p={1.5}
                  borderTop={1}
                  borderColor="divider"
                >
                  <Button
                    size="small"
                    onClick={cargarMasLeidas}
                    disabled={cargando}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  >
                    {cargando ? 'Cargando...' : 'Cargar más'}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Pie del Popover */}
        <Box
          sx={{
            p: 1.5,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            bgcolor: 'background.default',
          }}
        >
          <Button
            size="small"
            fullWidth
            onClick={() => {
              navigate('/mis-notificaciones');
              handleClose();
            }}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Ver todas las notificaciones
          </Button>
        </Box>
      </Popover>
    </>
  );
}
