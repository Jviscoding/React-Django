import { useContext } from "react";
import { MainpagePopupContext } from "../context/MainpagePopupContext";

export function useMainpagePopupContext() {

    const ctx = useContext(MainpagePopupContext);

    if (!ctx) throw new Error("Mainpage Pop up is missing!");

    return ctx





}