import React, { createContext, useMemo } from "react";
import useMainpagePopup, { type UseMainpagePopupType } from "../hooks/useMainpagePopup";


type MainpagePopupContextType = {
    mainPagePopupManager: UseMainpagePopupType;

}


export const MainpagePopupContext = createContext<MainpagePopupContextType | null>(null);

export default function MainpageUiPopupProvider({children}:{children: React.ReactNode}){


    const mainPagePopupManager = useMainpagePopup()


    const value = useMemo(()=>({
        
        mainPagePopupManager
    }), [mainPagePopupManager])



    return (
        <MainpagePopupContext.Provider value={value}>
            {children}


        </MainpagePopupContext.Provider>
    )




}