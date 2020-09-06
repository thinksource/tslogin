import { getDatabaseConnection } from "./db";
import { User, UserRole } from "../src/entity/User";
import { parse } from 'cookie';
import { verify } from 'jsonwebtoken';
import {GUID} from './auth'
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

export const decodeAuthCookie = (cookiestr: string)=>{
    const mycookie = parse(cookiestr)
    const decode = verify(mycookie.auth, GUID) as {id: string, role: UserRole, email: string}
    const {id, role, email} = decode
    const user = new User()
    user.id=id
    user.role=role
    user.email=email
    return user
}