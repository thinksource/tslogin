import { useReducer, useContext, createContext, Component, FC, ReactNode} from 'react'
// import { User } from '../interfaces'
import { User } from '../src/entity/User'
import { NextPageContext } from 'next'
import { decodeAuthCookie } from '../libs/user'
// const defaultUser: User = new User()

var UserStateContext:React.Context<User>
type Props = {
    cookies?: string,
    children?: ReactNode
}
export const UserProvider = ({cookies, children }: Props)=>{
    const defaultUser = decodeAuthCookie(cookies?cookies:'')
    UserStateContext= createContext<User>(defaultUser)
    return (
        <UserStateContext.Provider value={defaultUser}>
            {children}
        </UserStateContext.Provider>
    )

}

UserProvider.getInitialProps = async (ctx: NextPageContext) =>{
    const cookie = ctx.req?.headers.cookie;
    return {cookie}
}

export const useUser = () => useContext(UserStateContext)