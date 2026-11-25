import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { BorradorProvider } from "./context/BorradorContext.jsx";
import "./styles/index.css";

// Arranca la aplicación dentro del <div id="root"> de index.html. BrowserRouter
// permite usar rutas y BorradorProvider comparte el borrador de la solicitud
// con todos los componentes.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter useTransitions={false}>
      <BorradorProvider>
        <App />
      </BorradorProvider>
    </BrowserRouter>
  </StrictMode>,
);
