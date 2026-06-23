import React, { createContext, useMemo } from "react";
import type { UseUiAuthType } from "../hooks/useAuthUi";
import useUiAuth from "../hooks/useAuthUi";


export type AuthUiContextType = {
    authUiManager: UseUiAuthType
}


export const AuthUiContext = createContext<AuthUiContextType | null>(null);


export function AuthUiContextProvider({ children }: { children: React.ReactNode }) {

    const authUiManager = useUiAuth();

    const value = useMemo(() => ({
        authUiManager
    }), [authUiManager])


    return (
        <AuthUiContext.Provider value={value}>
            {children}
        </AuthUiContext.Provider>
    )
}