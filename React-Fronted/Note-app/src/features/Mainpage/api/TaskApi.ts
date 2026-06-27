import type { SupabaseClient } from "@supabase/supabase-js"
import { serverAddress } from "../../../shared/constants/constant"
import { useAuthContext } from "../../Auth/hooks/useAuthContext.ts"
import type { Task } from "../hooks/useMainpage.ts"


type TaskApiType = {
    getAllTask: () => Promise<any>
    createTask: (task: Task) => Promise<any>
}





export default function TaskApi(): TaskApiType {


    const { authManager } = useAuthContext()


    async function getAccessToken() {
        const session =
            await authManager.supabaseClient?.auth.getSession();

        return session?.data.session?.access_token ?? null;
    }

    const getAllTask = async () => {
        try {
            const accessToken = await getAccessToken();

            const result = await fetch(`${serverAddress.ip}:${serverAddress.port}/api/task`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`

                }
            })


            return await result.json()

        } catch (error) {

        }


    }


    const createTask = async (task: Task) => {


        console.log(task)

        try {
            const accessToken = await getAccessToken();

            const result = await fetch(`${serverAddress.ip}:${serverAddress.port}/api/task`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`

                },
                body: JSON.stringify({
                    task: task
                })
            })


            const data = await result.json()
            console.log(data)

        } catch (error) {

        }
    }


    const updateTask = () => {


    }

    const updateTaskState = () => {

    }

    const deleteTask = () => {

    }

    const updateSubtask = () => {

    }




    return {

        getAllTask,
        createTask
    }


}