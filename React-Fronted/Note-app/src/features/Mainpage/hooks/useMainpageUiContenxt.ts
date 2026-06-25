import { useContext } from "react";
import { MainpageUiContext } from "../context/MainpageUiContext";


export default function useMainpageUiContext() {
    const ctx = useContext(MainpageUiContext);


    if (!ctx) throw new Error("Mainpage Ui Context is missing!");

    return ctx;


}