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

    // Igual que en el crm-frontend: se escribe en localStorage de forma
    // sincrona dentro de login()/logout(), NO en un useEffect, para que
    // el primer fetch despues de navegar ya encuentre el token guardado.
    const login = (
        newToken: string,
        employeeId: string,
        employeeFullName: string
    ) => {

        localStorage.setItem("courseToken", newToken);
        localStorage.setItem("courseEmployeeId", employeeId);
        localStorage.setItem("courseFullName", employeeFullName);

        setToken(newToken);
        setId(employeeId);
        setFullName(employeeFullName);

    };


    const logout = () => {

        localStorage.removeItem("courseToken");
        localStorage.removeItem("courseEmployeeId");
        localStorage.removeItem("courseFullName");

        setToken(null);
        setId(null);
        setFullName(null);

    };


    return (
        <AuthContext.Provider
            value={{
                token,
                id,
                fullName,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
