import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { SolicitudesProvider } from "./context/SolicitudesContext.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter useTransitions={false}>
      <SolicitudesProvider>
        <App />
      </SolicitudesProvider>
    </BrowserRouter>
  </StrictMode>,
);
