import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayaout from "./global/layaouts/MainLayaout";
import Solicitud from "./modules/solicitudes/page/Solicitud";

function App() {
  return (
    <Router>
      <Routes>

        <Route element={<MainLayaout />}>

          <Route path="/" element={<h1>Home</h1>} />

          <Route path="/solicitudes" element={<Solicitud />} />

          {/*FALTAN*/}

          <Route path="/proveedores" element={<h1>proveedores</h1>} />
          <Route path="/compras" element={<h1>compras</h1>} />
          <Route path="/licitaciones" element={<h1>licitaciones</h1>} />
          <Route path="/ordenes" element={<h1>ordenes</h1>} />
          <Route path="/facturacion" element={<h1>facturacion</h1>} />
          <Route path="/comparacion" element={<h1>reportes</h1>} />
          <Route path="/analisis" element={<h1>analisis de Proveedores</h1>} />
          <Route path="/cuentas" element={<h1>Cuentas por Pagar</h1>} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
