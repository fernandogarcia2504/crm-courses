import { createContext } from "react";

export interface AuthContextType {
    token: string | null;
    id: string | null;
    fullName: string | null;
    mustChangePassword: boolean;
    login: (
        token: string,
        id: string,
        fullName: string,
        mustChangePassword: boolean
    ) => void;
    logout: () => void;
    clearMustChangePassword: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
