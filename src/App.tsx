import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Cobradores from "./pages/Cobradores/Cobradores";
import Clientes from './pages/Clientes/clientes';
import Creditos from "./pages/Creditos/Creditos";
import HistorialCobradores from "./pages/Cobradores/historialCobradores";
import Sedes from './pages/Configuracion/index';

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth Layout - PONER ESTAS PRIMERO */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Dashboard Layout - PROTEGIDAS */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Home />} /> {/* Cambiado de "/" a "/dashboard" */}
            <Route path="/cobradores" element={<Cobradores />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/creditos" element={<Creditos />} />
            <Route path="/historial-cobradores" element={<HistorialCobradores />} />
            <Route path="/sedes" element={<Sedes />} />
          </Route>

          {/* Redirección de raíz a login */}
          <Route path="/" element={<Navigate to="/signin" replace />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
