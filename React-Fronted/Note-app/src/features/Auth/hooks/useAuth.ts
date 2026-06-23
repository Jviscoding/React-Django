import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react"
import { serverAddress } from "../../../shared/components/constants/constant"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { LassoSelect } from "lucide-react"
import { useNavigate } from "react-router-dom"


export type UseAuthType = {

    supabaseClient: SupabaseClient | null
    setSupabaseClient: Dispatch<SetStateAction<SupabaseClient | null>>;

}

export type UserDataType = {
    id: string,
    email: string,
    first_name?: string,
    last_name?: string,


}

export type SignInType = {
    email: string,
    password: string
}


export type SignUpType = {
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    id: string
}



export default function useAuth(): UseAuthType {

    const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
    const clientCreated = useRef<boolean>(false)
    const hasInitialized = useRef<boolean>(false)
    const [userData, setUserData] = useState<UserDataType | null>(null)
    const nav = useNavigate()



    // initialize supabase client 
    useEffect(() => {

        if (!clientCreated.current) {
            const supabase = createClient(

                import.meta.env.VITE_SUPABASE_URL,
                import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)


            setSupabaseClient(supabase)

            clientCreated.current = true
        }


    }, [])


    // check aut status
    useEffect(() => {

        if (!supabaseClient) return;


        // when a user already signed in
        const init = async () => {

            const { data } = await supabaseClient.auth.getSession();

            if (data.session && !hasInitialized.current) {



                setUserData({
                    id: data.session.user.id,
                    email: data.session.user.email!,
                    first_name: "",
                    last_name: " "
                })

                // await setUserData(data.session)
                hasInitialized.current = true

            }

        };

        init();


        const { data } = supabaseClient.auth.onAuthStateChange(async (event, session) => {

            switch (event) {

                case "SIGNED_IN":

                    console.log("AUTO LOGIN")

                    if (!hasInitialized.current) {


                        setUserData({
                            id: session?.user.id!,
                            email: session?.user.email!,
                            first_name: "",
                            last_name: ""
                        })


                        hasInitialized.current = true
                    }
                    break

                case "SIGNED_OUT":
                    // setUser(null);
                    // setAccessToken(null);
                    break;

                case "TOKEN_REFRESHED":
                    // setAccessToken(session?.access_token ?? null);
                    break;
            }
        });


        return () => {
            data.subscription.unsubscribe();
        }




    }, [supabaseClient])



    const signUp = ({email, password, first_name, last_name, id}: SignUpType) => {
        const start = async () => {


            if (!supabaseClient) return;

            const { data, error } = await supabaseClient?.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: 'http://localhost:5173/redirect'
                }

            })


            // error handling
            switch (error?.code) {
                case 'validation_failed':
                    console.log(error.message)
                    return;


                default:
                    break;
            }

            switch (error?.status) {
                case 429:
                    console.log('Too many request')
                    return

                case 422:
                    return
            }

            // query additional cred
            // const response = await authApiManager.signUpApi({
            //     email: signUpForm.email!,
            //     firstName: signUpForm.firstName,
            //     lastName: signUpForm.lastName,
            //     id: data.user!.id
            // } as SignUpHook)



        }

        start()

    }

    const signOut = async () => {
        const error = await supabaseClient?.auth.signOut();


        hasInitialized.current = false;
        // // set user to null
        // setUser(null);
        // setAccessToken(null);

    }


    const signIn = async ({ email, password }: SignInType) => {


        if (!supabaseClient) return;

        try {
            // if (signInForm.email.trim() === "" || signInForm.password.trim() === "") return;


            const { data, error } = await supabaseClient?.auth.signInWithPassword({
                email: email,
                password: password
            })


            switch (error?.code) {
                case 'invalid_credentials':
                    console.log("INVALID CREDENTIAL")

                    return;
            }

            if (data.user) {
                console.log("LOGGED IN")
            }




        } catch (error) {

        }
    }

    // re direct to main page when logged in

    // NAVIGATION HANDLER
    useEffect(() => {


        if (window.location.href.includes('redirect')) return;


        console.log(userData)

        if (!userData || !userData.email) {

            nav('/auth');
            return
        }

        setTimeout(() => {

            nav('/mainpage');

        }, 2000)

    }, [userData])







    return {
        supabaseClient,
        setSupabaseClient
    }





}