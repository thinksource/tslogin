import {NextApiRequest, NextApiResponse} from 'next';
import {getDatabaseConnection} from '../../../libs/db';
import {User, UserRole} from '../../../src/entity/User';
import nextConnect from 'next-connect';

import { validate } from '../../../libs/user';

import handler from '../../../libs/handler'

  handler.post(async (req, res)=>{
    console.log(req.query)
    const {email, password, passwordConfirmation} = req.body;
    let db = (await getDatabaseConnection()).manager;
    const user : User = new User()
    if (!email || !password || !passwordConfirmation){
        
        res.status(400).json({'message':"fields not completed!"})
    }else{
        user.email = email.replace(/\s/g, "");
        user.password = password
        user.role = UserRole.active
        console.log(password)
        console.log(passwordConfirmation)
        if (await validate(user, passwordConfirmation)){
            console.log("saving now")
            console.log(user)
            const result=await db.save<User>(user)
            res.status(200).json(result)
        }else{
            res.status(400).json(
                {
                'message': user.errors
                }
            )
        }
    }
    
  }

  )

  export default handler