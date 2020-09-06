import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";


export default  nextConnect<NextApiRequest, NextApiResponse>({
    onNoMatch(req, res){
        res.status(405).json({error:`Method ${req.method} Not Allowed`});
    }
})