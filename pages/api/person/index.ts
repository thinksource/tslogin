import { NextApiRequest, NextApiResponse } from 'next'
import { authenticated, GUID } from '../../../libs/auth'
import { UserRole } from '../../../src/entity/User'
// import { sampleUserData } from '../utils/sample-data'
import { verify} from 'jsonwebtoken';
import { Person } from '../../../src/entity/Person';
import { getDatabaseConnection } from '../../../libs/db';
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   const decode = verify(req.cookies.auth, GUID).valueOf()
   console.log(decode)
   if('id' in decode){
    const db = await getDatabaseConnection()
    console.log("============")
    const repos = db.getRepository(Person);
    console.log(repos)
    const result = await repos.findOne({where: {user: decode['id']}})
    if (result){
         res.json(result)
    }else{
        res.json(new Person().toJSON())
    }
   }

}

export default authenticated(handler, [UserRole.active, UserRole.admin])