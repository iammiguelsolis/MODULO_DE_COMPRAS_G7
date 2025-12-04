import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayaout from "./global/layaouts/MainLayaout";
import Solicitud from "./modules/solicitudes/page/Solicitud";
import FacturacionApp from "./modules/facturación/page/FacturasProveedoresPage";
import LicitacionesListPage from "./modules/licitaciones/pages/LicitacionesListPage";
import LicitacionDetailPage from "./modules/licitaciones/pages/LicitacionDetailPage";
import LicitacionPage from "./modules/licitaciones/pages/LicitacionPage";
import ProveedorPage from "./modules/proveedor/page/ProveedorPage";
import ProveedorDetailPage from "./modules/proveedor/page/ProveedorDetailPage";
import AnalisisProveedoresPage from "./modules/analisisProveedor/page/AnalisisProveedoresPage";
import { ComparacionListPage } from "./modules/comparacion/pages/ComparacionListPage";
import { ComparacionPage } from "./modules/comparacion/pages/ComparacionPage";
import GenerarOrdenCompraPage from "./modules/ordenCompra/pages/GenerarOrdenCompra";

function App() {
  return (
    <Router>
      <Routes>

        <Route element={<MainLayaout />}>

          <Route path="/" element={<h1>Home</h1>} />

          <Route path="/solicitudes" element={<Solicitud />} />

          {/*FALTAN*/}

          <Route path="/proveedores" element={<ProveedorPage />} />
          <Route path="/proveedores/:id" element={<ProveedorDetailPage />} />
          <Route path="/compras" element={<h1>compras</h1>} />

          <Route path="/licitaciones" element={<LicitacionesListPage />} />
          <Route path="/licitacion/detail" element={<LicitacionDetailPage />} />
          <Route path="/licitaciones/crear" element={<LicitacionPage />} />

          <Route path="/ordenes" element={<GenerarOrdenCompraPage />} />
          <Route path="/facturacion" element={<FacturacionApp />} />

          <Route path="/comparacion" element={<ComparacionListPage />} />
          <Route path="/comparacion/:id" element={<ComparacionPage />} />

          <Route path="/analisis" element={<AnalisisProveedoresPage />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
