import React, { useState } from "react";

import { AuthContext } from "./authContextValue";

export const AuthProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("courseToken")
    );

    const [id, setId] = useState<string | null>(
        localStorage.getItem("courseEmployeeId")
    );

    const [fullName, setFullName] = useState<string | null>(
        localStorage.getItem("courseFullName")
    );

    // Por default true (mismo criterio que el backend): si no hay nada
    // guardado todavia, se asume que hay que pedir el cambio.
    const [mustChangePassword, setMustChangePassword] = useState<boolean>(
        localStorage.getItem("courseMustChangePassword") !== "false"
    );

    // Igual que en el crm-frontend: se escribe en localStorage de forma
    // sincrona dentro de login()/logout(), NO en un useEffect, para que
    // el primer fetch despues de navegar ya encuentre el token guardado.
    const login = (
        newToken: string,
        employeeId: string,
        employeeFullName: string,
        newMustChangePassword: boolean
    ) => {

        localStorage.setItem("courseToken", newToken);
        localStorage.setItem("courseEmployeeId", employeeId);
        localStorage.setItem("courseFullName", employeeFullName);
        localStorage.setItem("courseMustChangePassword", String(newMustChangePassword));

        setToken(newToken);
        setId(employeeId);
        setFullName(employeeFullName);
        setMustChangePassword(newMustChangePassword);

    };


    const logout = () => {

        localStorage.removeItem("courseToken");
        localStorage.removeItem("courseEmployeeId");
        localStorage.removeItem("courseFullName");
        localStorage.removeItem("courseMustChangePassword");

        setToken(null);
        setId(null);
        setFullName(null);
        setMustChangePassword(true);

    };

    const clearMustChangePassword = () => {
        localStorage.setItem("courseMustChangePassword", "false");
        setMustChangePassword(false);
    };


    return (
        <AuthContext.Provider
            value={{
                token,
                id,
                fullName,
                mustChangePassword,
                login,
                logout,
                clearMustChangePassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
