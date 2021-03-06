import { Box, Container, CssBaseline } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import axios, { Method } from 'axios';
import App, { AppInitialProps, AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import React, { useState } from 'react';
import { SWRConfig } from 'swr';
import { Nav } from '../components/Nav';
import { myRequest} from '../libs/auth';
import { useUser, UserProvider} from '../components/UserProvider';

import { verify} from 'jsonwebtoken';
import cookie from 'cookie';
import { GUID } from '../libs/auth';
import { UserRole } from '../src/entity/User';
// Create a theme instance.
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  }
});

function MyApp(appProps: AppProps) {
  
  const {Component, pageProps} = appProps
  // const {UserId, UserRole, email} = appProps as unknown as {UserId: string, UserRole: string, email: string}
  // const [MyId, setMyId] = useState<string>(UserId);
  
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);
  // async function getInitialProps (appContext: AppContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //   const str_cookie = appContext.ctx.req?.headers.cookie
  //   if(str_cookie){
  //     const ret = decodeAuthCookie(str_cookie)
  //     setMyId(ret.UserId)
  //     return ret
  //   }
  //   return { ...appProps }
  // }
  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <UserProvider>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Nav />
        <SWRConfig
          value={{ fetcher: (method: Method, data: any) => (url:string) => fetch(url, {method, body: data}) }}
        >
          <Container maxWidth={false}>
            <Box marginTop={2}>
              <Component {...pageProps} />
            </Box>
          </Container>
        </SWRConfig>
      </ThemeProvider>
      </UserProvider>
    </React.Fragment>
  )
}
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//   const str_cookie = appContext.ctx.req?.headers.cookie
//   if(str_cookie){
//     return decodeAuthCookie(str_cookie)
//   }
//   return { ...appProps }
// }
export default MyApp