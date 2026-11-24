import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Principal from "./pages/Principal.jsx";
import Buscador from "./pages/Buscador.jsx";
import DwellingPage from "./pages/DwellingPage.jsx";
import Calls from "./pages/Calls.jsx";
import CallPage from "./pages/CallPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import MisSolicitudes from "./pages/MisSolicitudes.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Principal />} />
        <Route path="/viviendas" element={<Buscador />} />
        <Route path="/viviendas/:id" element={<DwellingPage />} />
        <Route path="/convocatorias" element={<Calls />} />
        <Route path="/convocatorias/:id" element={<CallPage />} />
        <Route path="/mi-solicitud" element={<MisSolicitudes />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
export default App;
