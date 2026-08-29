import { createContext } from "react";

export interface AuthContextType {
    token: string | null;
    id: string | null;
    fullName: string | null;
    login: (
        token: string,
        id: string,
        fullName: string
    ) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
