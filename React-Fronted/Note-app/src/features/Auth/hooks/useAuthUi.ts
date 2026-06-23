import { useState, type Dispatch, type SetStateAction } from "react";



export type UseUiAuthType = {
    isSignUp: boolean;
    setIsSignUp: Dispatch<SetStateAction<boolean>>;

    authName: string;
    setAuthName: Dispatch<SetStateAction<string>>;

    authEmail: string;
    setAuthEmail: Dispatch<SetStateAction<string>>;

    authPassword: string;
    setAuthPassword: Dispatch<SetStateAction<string>>;

    authError: string;
    setAuthError: Dispatch<SetStateAction<string>>;

    authLoading: boolean;
    setAuthLoading: Dispatch<SetStateAction<boolean>>;
}



export default function useUiAuth(): UseUiAuthType {


    // --- Form Hooks / States ---
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [authName, setAuthName] = useState<string>("");
    const [authEmail, setAuthEmail] = useState<string>("");
    const [authPassword, setAuthPassword] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");
    const [authLoading, setAuthLoading] = useState<boolean>(false);


    return {
        isSignUp,
        setIsSignUp,
        authName,
        setAuthName,
        authEmail,
        setAuthEmail,
        authPassword,
        setAuthPassword,
        authError,
        setAuthError,
        authLoading,
        setAuthLoading,
    }





}