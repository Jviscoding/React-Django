import React, { createContext, useMemo } from "react";
import type { UseMainpageType } from "../hooks/useMainpage";
import  useMainpageUi, {type UseMainpageUiType}  from "../hooks/useMainpageUi";
import useMainpage from "../hooks/useMainpage";


type MainpageContextType = {
    mainpageManager: UseMainpageType;

}


export const MainpageContext = createContext<MainpageContextType | null>(null);

export default function MainpageProvider({children}:{children: React.ReactNode}){


    const mainpageManager = useMainpage()


    const value = useMemo(()=>({
        
        mainpageManager
    }), [mainpageManager])



    return (
        <MainpageContext.Provider value={value}>
            {children}

        </MainpageContext.Provider>
    )




}