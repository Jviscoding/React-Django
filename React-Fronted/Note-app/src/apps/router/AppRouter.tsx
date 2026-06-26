import { Navigate, Route, Routes } from "react-router-dom";
import Mainlayout from "../layout/MainLayout";
import TaskView from "../../features/Mainpage/pages/Mainpage";
import { AuthPage } from "../../features/Auth/pages/AuthPage";
import Sample from "../../features/Mainpage/pages/sample";


export default function AppRouter() {



    return (
        <Routes>
            <Route path="/mainpage" element={<Mainlayout />}>
                <Route index element={<TaskView />} />
                <Route path="calendar" element={<Sample />} />

            </Route>

            <Route path="/auth" element={<AuthPage />}>

            </Route>

            <Route path="*" element={<Navigate to={'/mainpage'} />}></Route>


        </Routes>

    )
}