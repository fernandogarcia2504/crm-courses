import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContextValue";

export default function ProtectedRoute() {

    const authContext = useContext(AuthContext);
    const location = useLocation();

    if (!authContext) {
        return null;
    }

    if (!authContext.token) {
        return <Navigate to="/" replace />;
    }

    // Bloquea todo el portal hasta que cambien la contraseña temporal,
    // excepto la pagina de cambio de contraseña misma (para no hacer un
    // loop de redirects).
    if (authContext.mustChangePassword && location.pathname !== "/cambiar-contrasena") {
        return <Navigate to="/cambiar-contrasena" replace />;
    }

    return <Outlet />;
}
