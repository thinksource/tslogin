import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { getDatabaseConnection } from "../../../libs/db";
import { Organization } from "../../../src/entity/Organization";
import { authenticated, authByRole } from "../../../libs/auth";
import { UserRole } from "../../../src/entity/User";
import handler from '../../../libs/handler'

handler.use(authByRole([UserRole.admin])).post(async (req, res)=>{
    const {id, name, brief, website, ostatus}= req.body
    const db = (await getDatabaseConnection()).manager
    // const dbrep = db.getRepository<Organization>('organization')
    if(!id){
        const org = new Organization()
        org.brief =brief
        org.name = name
        org.status = ostatus
        org.website = website
        db.save(org)
        res.status(200).json(org)
    }else{
        const result=await db.findOne(Organization, {id})
        if(result){
            result.brief =brief
            result.name = name
            result.status = ostatus
            result.website = website
            db.save(result)
            res.status(200).json(result)
        }else{
            res.status(404).json({"messge": "cannot find the organization"})
        }
    }
})

export default handler