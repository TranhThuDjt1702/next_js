'use server'

import mongoose from "mongoose"

let isConnect :  boolean = false
export const connectToDatabase = async()=>{
    if(!process.env.MONGODB_URL){
        throw new Error('MONGOODB_URL is not set')
    }
    if(isConnect){
        console.log('MONGOODB is already set')
        return
    }
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            dbName : 'ucademy'
        })
        isConnect = true
        console.log('database is connected')
    }catch(error){
        console.log('database meet an error when connect')
    }
}