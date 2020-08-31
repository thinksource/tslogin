import { NextApiResponse, NextApiHandler, NextApiRequest, NextPageContext } from "next";
import { verify} from 'jsonwebtoken';
import Axios, { Method } from "axios";
import { UserRole } from "../src/entity/User";

export const GUID ='274a5db6-334f-41b8-a87c-2609bc69e94e'

export const roleverify=(cookieStr: string, roles: UserRole[])=>{
    try{
        const decode = verify(cookieStr, GUID)
        console.log(decode)
        const djson = JSON.parse(JSON.stringify(decode))
        if(djson.role in roles){
            return true;
        }
        return false;
    }catch(err){
        return false;
    }
}



export const authenticated = (fn: NextApiHandler, roles: UserRole[]) => async (
    req: NextApiRequest,
    res: NextApiResponse
  ) =>{
    // verify(req.cookies.auth!, GUID, async function(err, decoded) {
    //     if (!err && decoded) {
    //         if(role.toString() === decoded.role)
    //             return await fn(req, res);
    //     }
    //     const message='Sorry you are not authenticated' 
    //     res.status(401).json({message})
    // });
    const decode = verify(req.cookies.auth!, GUID)
    const djson = JSON.parse(JSON.stringify(decode))
    for (let role of roles){
        if(role == djson.role){
          return await fn(req, res);  
        }
    }
    const message='Sorry you are not authenticated' 
    res.status(401).json({message})
}

export async function myGet(url: string, ctx: NextPageContext) {
    const cookie = ctx.req?.headers.cookie;

    const resp = await fetch(url, {
        headers: {
            cookie: cookie!
        }
    });

    // if(resp.status === 401 && !ctx.req) {
    //     Router.replace('/login');
    //     return {};
    // }

    if(resp.status === 401 && ctx.req) {
        ctx.res?.writeHead(302, {
            Location: '/login'
        });
        ctx.res?.end();
        return;
    }

    const json = await resp.json();
    return json;
}

export class myRequest{
    method: Method;
    data: JSON
    constructor(method:Method, data: any){
        this.method = method
        this.data = data
    }
    async send(url: string, ctx: NextPageContext){
        const req = ctx.req
        const cookie = ctx.req?.headers.cookie;
        const method = ctx.req?.method as Method;
        let resp: Response | undefined;
    
        if(method == 'get'){
            resp = await fetch(url, {
            headers: {
                cookie: cookie!
            }
        });
        }else if (method == 'post' || method == "put"){
            let body = '';
            
            req?.on('readable', ()=>{body+=req.read()})
            req?.on('end',async ()=>{
                
                const config= {method, url, data: JSON.parse(body), headers: {headers: {cookie: cookie!}}}
                await Axios.request(config).then(res=>{return res.data})
            })
            
        }else{
            resp = undefined
            return undefined
        }
    
        // if(resp.status === 401 && !ctx.req) {
        //     Router.replace('/login');
        //     return {};
        // }
    
        if(resp?.status === 401 && ctx.req) {
            ctx.res?.writeHead(302, {
                Location: '/login'
            });
            ctx.res?.end();
            return;
        }
    
        const json = await resp?.json();
        return json; 
    }
}
