'user server'

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { TCreateUserParams } from "@/app/types/index.d"


export async function createUser(params:TCreateUserParams):Promise<TCreateUserParams| undefined > {
    try{
        connectToDatabase()
        const newUser: TCreateUserParams = await User.create(params)
        return newUser
    }catch(error){
        // console.log("Error creating user:", error);
    }
}