import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { teal, lightBlue } from '@mui/material/colors';

function getTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: teal[600],
        light: teal[400],
        dark: teal[800],
        contrastText: "#fff",
      },
      secondary: {
        main: lightBlue[600],
        light: lightBlue[400],
        dark: lightBlue[800],
        contrastText: "#fff",
      },
      background:
        mode === "dark"
          ? { default: "#0f172a", paper: "#111827" }
          : { default: "#f7fafc", paper: "#ffffff" },
      text:
        mode === "dark"
          ? { primary: "#e5e7eb", secondary: "#9ca3af" }
          : { primary: "#1f2937", secondary: "#4b5563" },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: [
        '"Poppins"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
    }
  })
}

function Root() {
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "light");
  const theme = getTheme(mode);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    
    const r = document.documentElement.style;
    r.setProperty("--color-primary", theme.palette.primary.main);
    r.setProperty("--color-secondary", theme.palette.secondary.main);
    r.setProperty("--color-bg", theme.palette.background.default);
    r.setProperty("--color-surface", theme.palette.background.paper);
    r.setProperty("--color-text", theme.palette.text.primary);
    r.setProperty("--color-text-muted", theme.palette.text.secondary);

    document.documentElement.setAttribute("data-theme", mode);
  }, [mode, theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App toggleTheme={() => setMode((m) => (m === "light" ? "dark" : "light"))} />
      </BrowserRouter>
    </ThemeProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
