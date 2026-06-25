import React, { createContext, useMemo } from "react";
import type { UseMainpageType } from "../hooks/useMainpage";
import  useMainpageUi, {type UseMainpageUiType}  from "../hooks/useMainpageUi";


type MainpageUiContextType = {
    mainpageUiManager: UseMainpageUiType;

}


export const MainpageUiContext = createContext<MainpageUiContextType | null>(null);

export default function MainpageUiProvider({children}:{children: React.ReactNode}){


    const mainpageUiManager = useMainpageUi()


    const value = useMemo(()=>({
        
        mainpageUiManager
    }), [mainpageUiManager])



    return (
        <MainpageUiContext.Provider value={value}>
            {children}

        </MainpageUiContext.Provider>
    )




}