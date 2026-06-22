

type TaskApiType = {

    getTasks: () => Promise<any>;

}





export default function TaskApi(): TaskApiType {



    const getTasks = async () =>{

        updateUser();

        try {
            const request = await fetch(`http://127.0.0.1:8000/task_manager/?user_id=${1}`, {
                method: 'GET'
            });


            const data = await request.json();

            console.log(data);

            return data;

        } catch (error) {
            console.log(error);
        }
    }

    const updateUser = async() =>{
 try {
            const request = await fetch(`http://127.0.0.1:8000/task_manager/?user_id=${1}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({value: "sample value"})
            });


            const data = await request.json();

            console.log(data);

            return data;

        } catch (error) {
            console.log(error);
        }

    }


    return{

        getTasks

    }


}