import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, KeyRound } from "lucide-react";

import { AuthContext } from "../context/AuthContextValue";

export default function PortalLayout() {

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        authContext?.logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen w-full bg-canvas text-ink">
            <header className="sticky top-0 z-20 border-b border-line bg-surface">
                <div className="mx-auto flex max-w-[840px] items-center justify-between px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
                            <svg width="15" height="15" viewBox="0 0 26 26" fill="none">
                                <path d="M9 23 L10.5 9 H15.5 L17 23 Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
                                <path d="M8.5 15 H17.5" stroke="#fff" strokeWidth="1.5" />
                                <circle cx="13" cy="6.2" r="2.5" fill="#fff" />
                            </svg>
                        </span>
                        <span className="text-[0.92rem] font-semibold">Atalaya · Capacitación</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {authContext?.fullName && (
                            <span className="hidden text-[0.84rem] text-muted sm:inline">{authContext.fullName}</span>
                        )}
                        <button
                            onClick={() => navigate("/cambiar-contrasena")}
                            className="flex items-center gap-1.5 text-[0.82rem] text-muted transition-colors hover:text-ink"
                        >
                            <KeyRound size={15} />
                            <span className="hidden sm:inline">Cambiar contraseña</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-[0.82rem] text-muted transition-colors hover:text-danger"
                        >
                            <LogOut size={15} />
                            <span className="hidden sm:inline">Salir</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
}
