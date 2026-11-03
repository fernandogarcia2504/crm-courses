import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../app/context/AuthContextValue";

const API_URL = import.meta.env.VITE_API_URL;

const Mark = () => (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
        <svg width="21" height="21" viewBox="0 0 26 26" fill="none">
            <path d="M9 23 L10.5 9 H15.5 L17 23 Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M8.5 15 H17.5" stroke="#fff" strokeWidth="1.5" />
            <circle cx="13" cy="6.2" r="2.5" fill="#fff" />
        </svg>
    </span>
);

const input = "w-full rounded-md border border-line-2 bg-surface-2 px-3 py-2 text-[0.9rem] outline-none transition-colors focus:border-accent";

export default function LoginPage() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: "", password: "" });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const authContext = useContext(AuthContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(`${API_URL}/course-auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Credenciales incorrectas");
            }

            if (!authContext) {
                throw new Error("AuthContext no disponible");
            }

            authContext.login(
                data.token,
                data.employee.id,
                data.employee.fullName,
                data.employee.mustChangePassword
            );

            navigate(data.employee.mustChangePassword ? "/cambiar-contrasena" : "/curso");

        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Ocurrió un error al iniciar sesión");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-[400px] flex-col gap-8 px-6">

            <div className="flex flex-col items-center gap-3 text-center">
                <Mark />
                <div>
                    <p className="text-[0.95rem] font-semibold tracking-tight">Atalaya · Capacitación</p>
                    <h1 className="mt-1 text-[1.4rem] font-semibold tracking-tight">Curso de concientización</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 rounded-xl border border-line bg-surface p-6">
                <div className="flex flex-col gap-1">
                    <p className="text-[1.05rem] font-semibold">Iniciar sesión</p>
                    <p className="text-[0.84rem] text-muted">Usa las credenciales que te compartió tu empresa</p>
                </div>

                <div className="flex w-full flex-col gap-1.5">
                    <label className="text-[0.8rem] font-medium text-muted">Usuario</label>
                    <input name="username" value={formData.username} onChange={handleChange} type="text" className={input} placeholder="Tu correo o usuario" required />
                </div>

                <div className="flex w-full flex-col gap-1.5">
                    <label className="text-[0.8rem] font-medium text-muted">Contraseña</label>
                    <input name="password" value={formData.password} onChange={handleChange} type="password" className={input} placeholder="Tu contraseña temporal" required />
                </div>

                {error && <p className="text-[0.82rem] text-danger">{error}</p>}

                <button type="submit" disabled={loading} className="mt-2 w-full rounded-md bg-accent py-2 text-[0.9rem] font-semibold text-accent-ink transition-colors hover:bg-accent-2 disabled:opacity-60">
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
            </form>
        </div>
    );
}
