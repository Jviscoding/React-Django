import { Route, Routes } from "react-router-dom";
import Mainlayout from "../layout/MainLayout";
import TaskView from "../../features/Mainpage/pages/TaskView";


export default function AppRouter(){



    return(
        <Routes>
            <Route path="/mainpage" element={<Mainlayout/>}>
                <Route index element={<TaskView/>} ></Route>
            </Route>

            
        </Routes>
    )
}