import { getDatabaseConnection } from "./db";
import { User } from "../src/entity/User";

export async function validate(user: User, pw: string){
    const errors = new Array();
    user.errors=errors
    if(user.password !== pw) errors.push('password do not match of two input');
    if(user.email.length == 0) errors.push('username can not empty');
    if(user.password.length == 0) errors.push('password can not empty');
    try{
    let manager = (await getDatabaseConnection()).manager
    const found = await manager.findOne(User, {"email": user.email}).catch(e=>{console.log(e)});
    console.log("==================")
    console.log(found);
    if (found)
        errors.push('user email already exist')
    else
        console.log("validate ok")    
    }catch(e){
        console.log(e)
    }
    return  errors? true: false;
}