import i18next from "i18next";
import notificaciones_esp from "../i18n/notificaciones.esp.i18n.json" with { type: "json" };
// import notificaciones_eng from "./notificaciones.eng.i18n.json"; // ejemplo para agregar inglés
 
await i18next.init({
  lng: "esp",          // idioma activo
  fallbackLng: "esp",  // idioma de fallback si falta una clave en el activo
  resources: {
    esp: { notificaciones: notificaciones_esp },
    // eng: { notificaciones: notificaciones_eng }, // ejemplo para agregar inglés
  },
});
 
export default i18next;