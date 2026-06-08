import React from "react";
import { Tooltip, IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function CampanitaNotificacion() {
  return (
    <Tooltip title="Notificaciones">
      <IconButton color="inherit" className="notification-btn">
        <Badge badgeContent={4} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
