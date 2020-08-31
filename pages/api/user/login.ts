import {NextApiRequest, NextApiResponse} from 'next';
import {getDatabaseConnection} from '../../../libs/db';
import {User, UserRole, pwhash} from '../../../src/entity/User';
import nextConnect from 'next-connect';
import {sign} from 'jsonwebtoken';
import {GUID} from '../../../libs/auth'
import cookie from 'cookie'




const handler = nextConnect<NextApiRequest, NextApiResponse>({
    onNoMatch(req, res){
        res.status(405).json({error:`Method ${req.method} Not Allowed`});
    }
  })

handler.post(async (req, res)=>{
    let message:string;
    const db =  (await getDatabaseConnection()).getRepository(User);
    const {email, password} = req.body
    console.log(req.body)
    console.log(email, password)
    const result= await db.findOne({where : {email}})
    console.log("=,------")
    console.log(result)
    if (result){
        const pw_hash = pwhash(password, result.salt)
        if (pw_hash === result.password && result.role !== UserRole.blocked){
            const claim =  {email: result.email, id: result.id, role: result.role}
            const jwt = sign(claim, GUID, {expiresIn: '2h'})
            const auth_cookie = cookie.serialize('auth', jwt, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 3600,
                path: '/'
            })
            res.setHeader('Set-Cookie', auth_cookie)
            res.status(200).json({jwt})
        }else{
            message = "can not authority"
            res.status(401).json({message})
        }
    }else{
        message = "can not find the email address";
        res.status(401).json({message})
    }
})

export default handler