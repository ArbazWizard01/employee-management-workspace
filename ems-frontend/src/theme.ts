import { createTheme } from "@mui/material/styles";

export const getAppTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#2563eb",
        dark: "#1d4ed8",
        light: "#60a5fa",
      },
      background: {
        default: mode === "dark" ? "#030712" : "#f8fafc",
        paper: mode === "dark" ? "#090f1c" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#0f172a",
        secondary: mode === "dark" ? "#94a3b8" : "#475569",
      },
      divider: mode === "dark" ? "#1e293b" : "#e2e8f0",
      success: { main: "#10b981" },
      error: { main: "#f43f5e" },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h5: { fontWeight: 800, letterSpacing: "-0.02em" },
      h6: { fontWeight: 700, letterSpacing: "-0.01em" },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
  });
