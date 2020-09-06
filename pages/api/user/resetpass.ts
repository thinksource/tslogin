import { NextApiRequest, NextApiResponse } from 'next'
import { authenticated, decodeAuthCookie, authById } from '../../../libs/auth'
import { UserRole, User, pwhash } from '../../../src/entity/User'
import nextConnect from 'next-connect';
import { getDatabaseConnection } from '../../../libs/db';
// import { sampleUserData } from '../utils/sample-data'
let userId:string="";

import handler from '../../../libs/handler'

handler.use((req, _res)=>{
    const {id}= req.body
    userId = id
}).use(authById(userId)).post(async (req, res)=>{
    console.log(req.body)
    let message:string;
    const db = await getDatabaseConnection()
    const dbmag = db.manager;
    // decodeAuthCookie(req.headers.cookie?req.headers.cookie:'')
    const {id, oldpass, newpass} = req.body
    console.log("==========")
    try{
    const result= await dbmag.findOne<User>('user', {id})
    console.log(result)
    if(result){
        const pw_hash = pwhash(oldpass, result.salt)
        if (pw_hash === result.password){
            // result.generateSalt()
            result.password = pwhash(newpass, result.salt)
            await dbmag.save(result)
            res.status(200)
        }else{
            console.log(pw_hash,'=', result.password)
            res.status(400)
        }
    }else{
        console.log("cannot find user")
        res.status(400)
    }
    }
    catch(e){
        console.log(e)
    }
    res.json({"done": "done"})

})


export default handler