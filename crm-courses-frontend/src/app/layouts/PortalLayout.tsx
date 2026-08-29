import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, KeyRound } from "lucide-react";

import { AuthContext } from "../context/authContextValue";

export default function PortalLayout() {

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        authContext?.logout();
        navigate("/");
    };

    return (
        <div className="bg-[#141414] w-full min-h-screen text-[#ECECEC]">
            <header className="w-full flex items-center justify-between px-6 py-4 border-b border-[#262626]">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-[#2F76D2]" size={22} />
                    <span className="text-sm text-[#959595]">
                        Curso de Concientizacion en Ciberseguridad
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {authContext?.fullName && (
                        <span className="text-sm">{authContext.fullName}</span>
                    )}
                    <button
                        onClick={() => navigate("/cambiar-contrasena")}
                        className="flex items-center gap-1 text-sm text-[#959595] hover:text-[#ECECEC] cursor-pointer"
                    >
                        <KeyRound size={16} />
                        Cambiar contrasena
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-sm text-[#959595] hover:text-[#ECECEC] cursor-pointer"
                    >
                        <LogOut size={16} />
                        Cerrar sesion
                    </button>
                </div>
            </header>

            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
}
