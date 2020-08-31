import {NextApiRequest, NextApiResponse} from 'next';
import {getDatabaseConnection} from '../../../libs/db';
import {User, UserRole} from '../../../src/entity/User';
import nextConnect from 'next-connect';

import { user_validate } from '../../../libs/validate';

const handler = nextConnect<NextApiRequest, NextApiResponse>({
    onNoMatch(req, res){
      res.status(405).json({error:`Method ${req.method} Not Allowed`});
    }
  })

  handler.post(async (req, res)=>{
    console.log(req.query)
    const {email, password, passwordConfirmation} = req.body;
    let db = (await getDatabaseConnection()).manager;
    const user : User = new User()
    console.log()
    if (!email || !password || !passwordConfirmation){
        
        res.status(400).json({'message':"fields not completed!"})
    }else{
        user.email = email.replace(/\s/g, "");
        user.password = password
        user.role = UserRole.active
        console.log(password)
        console.log(passwordConfirmation)
        if (await user_validate(user, passwordConfirmation)){
            console.log(user)
            await db.save(user)
            res.status(200).json(user)
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