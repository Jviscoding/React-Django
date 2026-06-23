import React, { createContext, useMemo } from "react";
import type { UseAuthType } from "../hooks/useAuth";
import useAuth from "../hooks/useAuth";


export type AuthContextType = {
    authManager: UseAuthType
}


export const AuthContext = createContext<AuthContextType | null>(null);


export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const authManager = useAuth();

    
    const value = useMemo(() => ({
        authManager
    }), [authManager])


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}