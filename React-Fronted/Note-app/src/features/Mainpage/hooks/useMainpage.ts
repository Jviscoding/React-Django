import { useAuthContext } from "../../Auth/hooks/useAuthContext.ts"
import TaskApi from "../api/TaskApi.js";


export type UseMainpageType= {

    getAllTaskData: ()=>Promise<any>

}


export default function useMainpage(): UseMainpageType{
    
    const taskApiManager = TaskApi()




    const getAllTaskData = async()=>{
        try {
            
            const request = await taskApiManager.getAllTask();

            console.log(request)
            
        } catch (error) {
            
        }
    }


    

    return{
        getAllTaskData

    }
}