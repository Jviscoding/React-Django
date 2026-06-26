import { useContext } from "react";
import { MainpageContext } from "../context/MainpageContext";


export default function useMainpageContext(){

    const ctx = useContext(MainpageContext);

    if(!ctx) throw new Error("Mainpage Context is missing!");

    return ctx
    
}