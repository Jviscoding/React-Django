import { useContext } from "react"
import { AuthUiContext } from "../context/AuthUiContext"

export const useUiAuthContext = () =>{
    const ctx = useContext(AuthUiContext);

    if (!ctx){
        throw new Error("Auth Ui Context is missing!");
        
    }
    return ctx


}