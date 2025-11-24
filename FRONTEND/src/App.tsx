import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayaout from "./global/layaouts/MainLayaout";
import Solicitud from "./modules/solicitudes/page/Solicitud";
function App() {

  return (
    <Router>
      <Routes>

        <Route element={<MainLayaout />}>
          <Route path="/*" element={<Solicitud />} />
        </Route>

      </Routes>
    </Router>
  )
}

export default App
