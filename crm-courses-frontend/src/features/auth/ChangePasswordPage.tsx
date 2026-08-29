import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";

import { AuthContext } from "../../app/context/authContextValue";

const API_URL = import.meta.env.VITE_API_URL;

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
                setError("Ocurrio un error al cambiar la contraseña");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 px-4">

            <div className="flex flex-col items-center gap-2">
                <KeyRound size={40} className="text-[#2F76D2]" />
                <h1 className="text-2xl text-center">
                    {isForced ? "Cambia tu contraseña temporal" : "Cambiar contraseña"}
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-[#1A1A1A] flex flex-col gap-4 rounded-md shadow-lg p-6"
            >
                <div className="flex flex-col gap-1">
                    {isForced && (
                        <p className="text-sm text-[#959595]">
                            Por seguridad, antes de continuar necesitas cambiar la contraseña temporal que te compartió tu empresa por una tuya.
                        </p>
                    )}
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">Contraseña actual</label>
                    <input
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        type="password"
                        className="w-full rounded-md px-3 py-2 bg-[#212121] placeholder:text-sm"
                        placeholder={isForced ? "Tu contraseña temporal" : "Tu contraseña actual"}
                        required
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">Contraseña nueva</label>
                    <input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                        className="w-full rounded-md px-3 py-2 bg-[#212121] placeholder:text-sm"
                        placeholder="Mínimo 8 caracteres"
                        required
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">Confirma la contraseña nueva</label>
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        className="w-full rounded-md px-3 py-2 bg-[#212121] placeholder:text-sm"
                        required
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-400">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md py-2 bg-[#2F76D2] mt-4 cursor-pointer disabled:opacity-60"
                >
                    {loading ? "Guardando..." : "Cambiar contraseña"}
                </button>

                {!isForced && (
                    <button
                        type="button"
                        onClick={() => navigate("/curso")}
                        className="w-full text-sm text-[#959595] hover:text-[#ECECEC]"
                    >
                        Cancelar
                    </button>
                )}
            </form>
        </div>
    );
}
