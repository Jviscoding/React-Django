import { Navigate, Route, Routes } from "react-router-dom";
import Mainlayout from "../layout/MainLayout";
import TaskView from "../../features/Mainpage/pages/Mainpage";


export default function AppRouter(){



    return(
        <Routes>
            <Route path="/mainpage" element={<Mainlayout/>}>
                <Route index element={<TaskView/>} />

            </Route>

            <Route path="*" element={<Navigate to={'/mainpage'} />}></Route>

            
        </Routes>
        
    )
}