import { data } from "react-router-dom";
import { serverAddress } from "../../../shared/constants/constant.ts";
import { useContext } from "react";
import { useAuthContext } from "../hooks/useAuthContext.ts";
import type { SignUpType } from "../hooks/useAuth";
import type { SupabaseClient } from "@supabase/supabase-js";


export type AuthApiType = {

    getProfile: () => Promise<any>
    setProfile: (arg0: SignUpType) => Promise<any>


}



export default function authApi(supabaseClient: SupabaseClient | null): AuthApiType {




    async function getAccessToken() {
        const session =
            await supabaseClient?.auth.getSession();

        return session?.data.session?.access_token ?? null;
    }

    const getProfile = async () => {
        try {

            const accessToken = await getAccessToken();
            const request = await fetch(`${serverAddress.ip}:${serverAddress.port}/auth/profile`, {

                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`

                }
            });

            const data = await request.json();

            console.log(data)

            return data


        } catch (error) {

        }
    }


    const setProfile = async ({ first_name, last_name, id }: SignUpType) => {
        try {

            const accessToken = await getAccessToken();
            const request = await fetch(`${serverAddress.ip}:${serverAddress.port}/auth/profile`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    first_name: first_name,
                    last_name: last_name,
                    id: id
                })
            });

            const data = await request.json();

            console.log(data)

            return data


        } catch (error) {

        }
    }





    return {
        setProfile,
        getProfile
    }


}