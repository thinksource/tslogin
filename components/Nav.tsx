import { AppBar, Button, makeStyles, Toolbar, Typography, Menu, MenuItem} from '@material-ui/core';
// import Link from 'next/link';
import Link from 'next/link'
import React from 'react';
import { NextPageContext } from 'next';
import { verify} from 'jsonwebtoken';
import cookie from 'cookie';
import { GUID, decodeAuthCookie } from '../libs/auth';
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

interface NavProps {
    userId?: string,
    userRole?: string,
    email?: string
}


const ProfileButton =(props: NavProps)=>{
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(props)
  if(props.userId){
    return (
      <>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
      {props.email}
      </Button>
      <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}>
      <MenuItem onClick={handleClose}>
        <Link href="/person">
          <a>Profile</a>
        </Link>
        </MenuItem>
      <MenuItem onClick={handleClose}>          
      <Link href = {`/user/${props.userId}`}>
            <a>My account</a>
      </Link>
      </MenuItem>
      <MenuItem onClick={handleClose}>      
      <Link href ="/user/logout">
            <a>Logout</a>
      </Link></MenuItem>
      </Menu>
      </>
    )
  }else{
    return (
      <Button>
        <Link href="/login">
          <a style={{ color: 'white' }}>
            Login
          </a>
        </Link>
      </Button>
    )
  }
}

const OrgButton =(props: NavProps)=>{
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(props)
  if(props.userRole === 'admin'){
    return (
      <>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
      Organization
      </Button>
      <Menu
      id="og-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}>
      <MenuItem onClick={handleClose}>
        <Link href="/organization/add">
          <a>add</a>
        </Link>
        </MenuItem>
      <MenuItem onClick={handleClose}>          
      <Link href = "/organization/list">
            <a>list organization</a>
      </Link>
      </MenuItem>
      </Menu>
      </>
    )
  }else{
    return (
      <Button>
        <Link href="/login">
          <a style={{ color: 'white' }}>
            regist a organization
          </a>
        </Link>
      </Button>
    )
  }
}
export const Nav = (props: NavProps)=> {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [MyId, setMyId] = React.useState<string | undefined>(props.userId);
//   const stateChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
//     console.log(event.target.value);
// };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(props)
  console.log(classes)
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography className={classes.title}>
          My Form
        </Typography>

        <Button color="inherit">
          <Link href="/">
            <a style={{ color: 'white' }}>
              <Typography  color="inherit">
                Home
              </Typography>
            </a>
          </Link>
        </Button>


      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Project
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <Link href="/person">
            <a>Personal Profile</a>
          </Link>
          </MenuItem>
        <MenuItem onClick={handleClose}>          
          <Link href = {`/user/${props.userId}`}>
            <a>My account</a>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
      <OrgButton></OrgButton>
      <ProfileButton userId={props.userId} userRole={props.userRole} email={props.email}></ProfileButton>
      </Toolbar>
    </AppBar>
  );
}

Nav.getInitialProps = async (ctx: NextPageContext) =>{
  const str_cookie =ctx.req?.headers.cookie
  const ret_obj={}
  console.log("Nav init")
  if(str_cookie){
    // const mycookie = cookie.parse(str_cookie);

    // const decode = verify(mycookie.auth, GUID).valueOf() as {id: string, role: string, email:string}
    // console.log(decode)
    const decode = decodeAuthCookie(str_cookie)
    console.log("Nav init", decode)
    return decode
    
  }
  
}