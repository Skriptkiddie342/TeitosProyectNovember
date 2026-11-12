import { Routes, Route } from "react-router-dom";
import Layout from "./Layouts/Layout.jsx";
import Principal from "./Pages/Principal.jsx";
import Buscador from "./Pages/Buscador.jsx";
import DwellingPage from "./Pages/DwellingPage.jsx";
import Calls from "./Pages/Calls.jsx";
import CallPage from "./Pages/CallPage.jsx";
import NotFound from "./Pages/NotFound.jsx";
import MisSolicitudes from "./Pages/MisSolicitudes.jsx";

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
