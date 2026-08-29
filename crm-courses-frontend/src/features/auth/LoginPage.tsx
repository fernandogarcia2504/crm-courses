import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import { AuthContext } from "../../app/context/authContextValue";

const API_URL = import.meta.env.VITE_API_URL;

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
                data.employee.fullName
            );

            navigate("/curso");

        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Ocurrio un error al iniciar sesion");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 px-4">

            <div className="flex flex-col items-center gap-2">
                <ShieldCheck size={40} className="text-[#2F76D2]" />
                <h1 className="text-2xl text-center">
                    Curso de Concientizacion en Ciberseguridad
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-[#1A1A1A] flex flex-col gap-4 rounded-md shadow-lg p-6"
            >
                <div className="flex flex-col gap-1">
                    <p className="text-xl">Iniciar Sesion</p>
                    <p className="text-sm text-[#959595]">
                        Usa las credenciales que te compartio tu empresa
                    </p>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">Usuario</label>
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        type="text"
                        className="w-full rounded-md px-3 py-2 bg-[#212121] placeholder:text-sm"
                        placeholder="Tu correo o usuario"
                        required
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">Contrasena</label>
                    <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        className="w-full rounded-md px-3 py-2 bg-[#212121] placeholder:text-sm"
                        placeholder="Tu contrasena temporal"
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
                    {loading ? "Iniciando sesion..." : "Iniciar Sesion"}
                </button>
            </form>
        </div>
    );
}
