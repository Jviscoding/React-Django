import { useState, type Dispatch, type SetStateAction } from "react";
import { useAuthContext } from "./useAuthContext.ts";
import type { SignInType, SignUpType } from "./useAuth";



export type UseUiAuthType = {
    isSignUp: boolean;
    setIsSignUp: Dispatch<SetStateAction<boolean>>;

    authName: string;
    setAuthName: Dispatch<SetStateAction<string>>;

    authEmail: string;
    setAuthEmail: Dispatch<SetStateAction<string>>;

    authPassword: string;
    setAuthPassword: Dispatch<SetStateAction<string>>;

    authConfirmPass: string;
    setAuthConfirmPass: Dispatch<SetStateAction<string>>;

    authError: string;
    setAuthError: Dispatch<SetStateAction<string>>;

    authLoading: boolean;
    setAuthLoading: Dispatch<SetStateAction<boolean>>;


    initSendSignInCred: () => Promise<any>;
    initSendSignUpCred: () => Promise<any>;

    isSuccess: boolean;
    setIsSuccess: Dispatch<SetStateAction<boolean>>;


}



export default function useUiAuth(): UseUiAuthType {


    // --- Form Hooks / States ---
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [authName, setAuthName] = useState<string>("");
    const [authEmail, setAuthEmail] = useState<string>("");
    const [authPassword, setAuthPassword] = useState<string>("");
    const [authConfirmPass, setAuthConfirmPass] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");
    const [authLoading, setAuthLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const { authManager } = useAuthContext()


    const initSendSignInCred = async () => {

        setAuthLoading(true)
        setIsSuccess(false)
        setAuthError("")

        if (authEmail.trim() === "" || authPassword === "") {

            setAuthLoading(false)
            setAuthError("Missing input information")

            return;
        }

        const response = await authManager.signIn({ email: authEmail, password: authPassword } as SignInType)


        if (response) {
            setIsSuccess(true)
            setAuthLoading(true)
            setAuthError("Login Successfully!")

            return;
        }

        setAuthLoading(false)
        setAuthError("Invalid email or password")


    }

    const initSendSignUpCred = async () => {

        setAuthLoading(true)
        setIsSuccess(false)
        setAuthError("")

        const response = await authManager.signUp(
            {
                email: authEmail,
                password: authPassword,
                username: authName
            } as SignUpType);

            console.log(response.code)

        if (response.code || response.status) {

            // error handling
            switch (response.code) {
                case 'validation_failed':
                    console.log(response.message)
                    return;


                default:
                    break;
            }

            switch (response.status) {
                case 429:
                    setAuthError("Too many request")
                    setAuthLoading(false)

                    return;

                case 422:
                    return
            }
        }

        setAuthError("Account Creation Successfully!");
        setIsSuccess(true)




        return {}
    }



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
        initSendSignInCred,
        initSendSignUpCred,
        authConfirmPass,
        setAuthConfirmPass,
        isSuccess,
        setIsSuccess
    }





}