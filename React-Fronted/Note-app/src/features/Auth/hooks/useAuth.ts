import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react"
import { serverAddress } from "../../../shared/constants/constant"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { LassoSelect } from "lucide-react"
import { useNavigate } from "react-router-dom"
import authApi from "../api/authApi"


export type UseAuthType = {

    supabaseClient: SupabaseClient | null;
    setSupabaseClient: Dispatch<SetStateAction<SupabaseClient | null>>;
    signIn: (Arg0: SignInType) => Promise<any>;
    signUp: (Arg0: SignUpType) => Promise<any>;
    signOut: () => Promise<any>
    userData:UserDataType | null
    setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>
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
    confirm_pass: string,
    username: string,
    id: string
}



export default function useAuth(): UseAuthType {

    const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
    const clientCreated = useRef<boolean>(false)
    const hasInitialized = useRef<boolean>(false)
    const [userData, setUserData] = useState<UserDataType | null>(null)
    const nav = useNavigate()

    const authApiManager = authApi(supabaseClient)


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

                // set user data
                setUserInfo(data.session)


                // await setUserData(data.session)
                hasInitialized.current = true

                return

            }

        };

        init();


        const { data } = supabaseClient.auth.onAuthStateChange(async (event, session) => {

            switch (event) {

                case "SIGNED_IN":

                    console.log("SIGNED IN")
                    if (!hasInitialized.current) {

                        // set user data
                        setUserInfo(session)


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



    const signUp = async ({ email, password, username }: SignUpType) => {


        if (!supabaseClient) return;

        const { data, error } = await supabaseClient?.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: 'http://localhost:5173/redirect'
            }
        })
        
        if (error) {
            return error
        }

        await authApiManager.setProfile({
            username: username,
            id: data.user?.id
        } as SignUpType)



        return data

        // // error handling
        // switch (error?.code) {
        //     case 'validation_failed':
        //         console.log(error.message)
        //         return;


        //     default:
        //         break;
        // }

        // switch (error?.status) {
        //     case 429:
        //         console.log('Too many request')
        //         return "Too many request, come back later"

        //     case 422:
        //         return
        // }


    }

    const signOut = async () => {
        const error = await supabaseClient?.auth.signOut();


        hasInitialized.current = false;
        setUserData(null)

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



            return (data)


        } catch (error) {
            console.log(error)
        }
    }


    const setUserInfo = async (session: any) => {


        try {
            const response = await authApiManager.getProfile()

            if (response.success) {
                setUserData({
                    id: session.user.id,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    email: session.user.email
                });

                return;
            }
            setUserData({
                id: session.user.id,
                email: session.user.email
            });

        } catch (error) {

        }

    }

    useEffect(() => {
        console.log(userData)
    }, [userData])
    // re direct to main page when logged in

    // NAVIGATION HANDLER
    useEffect(() => {
        if (window.location.href.includes('redirect')) return;

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
        setSupabaseClient,
        signIn,
        signUp,
        signOut,
        userData,
        setUserData
    }





}