import { NextApiResponse, NextApiHandler, NextApiRequest, NextPageContext } from "next";
import { verify, sign} from 'jsonwebtoken';
import Axios, { Method } from "axios";
import { UserRole } from "../src/entity/User";
import cookie, { parse } from 'cookie';

import nextConnect, { NextHandler } from "next-connect";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import { IncomingMessage } from "http";

const TOKEN_NAME = 'auth'
export const GUID ='274a5db6-334f-41b8-a87c-2609bc69e94e'
type middleFunction = (req: IncomingMessage, res:NextApiResponse, next: NextHandler)=>void

export function setAuthCookie(res: NextApiResponse, token: Object){
    const jwt = sign(token, GUID, {expiresIn: '2h'})
    const auth_cookie = cookie.serialize(TOKEN_NAME, jwt, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600,
        path: '/'
    })
    res.setHeader('Set-Cookie', auth_cookie)
    return jwt
}

export function removeAuthCookie(res: NextApiResponse) {
    const auth_cookie = cookie.serialize(TOKEN_NAME, '', {
      maxAge: -1,
      httpOnly: true,
      path: '/',
    })
  
    res.setHeader('Set-Cookie', auth_cookie)
  }


export const decodeAuthCookie = (cookiestr: string)=>{
    const mycookie = cookie.parse(cookiestr)
    const decode = verify(mycookie.auth, GUID) as {id: string, role: UserRole, email: string}
    const {id, role, email} = decode
    return {UserId: id, UserRole: role, 'email': email}
}

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

export function authByRole(roles: UserRole[]):middleFunction{
    return (req: IncomingMessage, res:NextApiResponse, next: NextHandler)=>{
      const cookiestr=req.headers?.cookie
      if(cookiestr){
        try{
          const cookieobj = parse(cookiestr)
          const decode = verify(cookieobj[TOKEN_NAME], GUID)
          
          const djson = JSON.parse(JSON.stringify(decode))
          if(djson && roles.indexOf(djson.role)>=0){
            next()
          }else{
            res.status(401).json({message: 'User do not have right to visit this page'})
            // next({message: 'User do not have right to visit this page'})
          }
        }catch(e){
          res.status(401).json({message:'Please login again'})
        }
      }else{
        res.redirect('/')
      }
    }
  }

  export function authById(userId: string):middleFunction{
    return (req: IncomingMessage, res:NextApiResponse, next: NextHandler)=>{
      const cookiestr=req.headers?.cookie
      if(cookiestr){
        try{
          const cookieobj = parse(cookiestr)
          const decode = verify(cookieobj[TOKEN_NAME], GUID)
          
          const djson = JSON.parse(JSON.stringify(decode))
          if(djson && djson.id === userId){
            next()
          }else{
            res.status(401).json({message: 'User do not have right to visit this page'})
            // next({message: 'User do not have right to visit this page'})
          }
        }catch(e){
          res.status(401).json({message:'Please login again'})
        }
      }else{
        res.redirect('/')
      }
    }
  }