import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";

import { AuthContext } from "../../app/context/AuthContextValue";

const API_URL = import.meta.env.VITE_API_URL;

const input = "w-full rounded-md border border-line-2 bg-surface-2 px-3 py-2 text-[0.9rem] outline-none transition-colors focus:border-accent";

export default function ChangePasswordPage() {

    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isForced = authContext?.mustChangePassword ?? false;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        setError("");

        if (newPassword.length < 8) {
            setError("La nueva contraseña debe tener al menos 8 caracteres");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas nuevas no coinciden");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(`${API_URL}/course-portal/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authContext?.token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "No se pudo cambiar la contraseña");
            }

            authContext?.clearMustChangePassword();
            navigate("/curso");

        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Ocurrió un error al cambiar la contraseña");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-[400px] flex-col gap-8 px-6">

            <div className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-accent">
                    <KeyRound size={22} />
                </span>
                <h1 className="text-[1.3rem] font-semibold tracking-tight">
                    {isForced ? "Cambia tu contraseña temporal" : "Cambiar contraseña"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 rounded-xl border border-line bg-surface p-6">
                {isForced && (
                    <p className="text-[0.84rem] text-muted">
                        Por seguridad, antes de continuar necesitas cambiar la contraseña temporal que te compartió tu empresa por una tuya.
                    </p>
                )}

                <div className="flex w-full flex-col gap-1.5">
                    <label className="text-[0.8rem] font-medium text-muted">Contraseña actual</label>
                    <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" className={input} placeholder={isForced ? "Tu contraseña temporal" : "Tu contraseña actual"} required />
                </div>

                <div className="flex w-full flex-col gap-1.5">
                    <label className="text-[0.8rem] font-medium text-muted">Contraseña nueva</label>
                    <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className={input} placeholder="Mínimo 8 caracteres" required />
                </div>

                <div className="flex w-full flex-col gap-1.5">
                    <label className="text-[0.8rem] font-medium text-muted">Confirma la contraseña nueva</label>
                    <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className={input} required />
                </div>

                {error && <p className="text-[0.82rem] text-danger">{error}</p>}

                <button type="submit" disabled={loading} className="mt-2 w-full rounded-md bg-accent py-2 text-[0.9rem] font-semibold text-accent-ink transition-colors hover:bg-accent-2 disabled:opacity-60">
                    {loading ? "Guardando..." : "Cambiar contraseña"}
                </button>

                {!isForced && (
                    <button type="button" onClick={() => navigate("/curso")} className="w-full text-[0.82rem] text-muted transition-colors hover:text-ink">
                        Cancelar
                    </button>
                )}
            </form>
        </div>
    );
}
