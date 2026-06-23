import { Navigate, Route, Routes } from "react-router-dom";
import Mainlayout from "../layout/MainLayout";
import TaskView from "../../features/Mainpage/pages/Mainpage";
import { AuthPage } from "../../features/Auth/pages/AuthPage";


export default function AppRouter(){



    return(
        <Routes>
            <Route path="/mainpage" element={<Mainlayout/>}>
                <Route index element={<TaskView/>} />

            </Route>
            <Route path="/auth" element={<AuthPage onAuthSuccess={function (user: UserSession): void {
                throw new Error("Function not implemented.");
            } } triggerNotification={function (message: string, type: "success" | "error"): void {
                throw new Error("Function not implemented.");
            } }/>}>
                <Route index element={<TaskView/>} />

            </Route>

            <Route path="*" element={<Navigate to={'/mainpage'} />}></Route>

            
        </Routes>
        
    )
}