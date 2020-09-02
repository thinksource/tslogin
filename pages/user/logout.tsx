import { NextPageContext, GetServerSideProps } from "next"
import cookie from 'cookie';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { removeAuthCookie } from "../../libs/auth";
// const logout = ()=>{
//    return (<div/>)
// }


// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//     const auth_cookie = cookie.serialize('auth', '', {
//         maxAge: -1,
//         httpOnly: true,
//         path: '/',
//       })
//     const header = {'Locaiton': '/','Set-Cookie': auth_cookie}
    
//     ctx.res.writeHead(302, header)

//     return { props: { names: ['john', 'doe', 'michael', 'bruno'] } };
// };

// export default logout

export default async function logout(_req: NextApiRequest, res:NextApiResponse ) {
    removeAuthCookie(res)
    res.writeHead(302, { Location: '/' })
    res.json({})
  }