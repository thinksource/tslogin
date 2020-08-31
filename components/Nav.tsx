import { AppBar, Button, makeStyles, Toolbar, Typography, Menu, MenuItem} from '@material-ui/core';
// import Link from 'next/link';
import Link from 'next/link'
import React from 'react';
import { NextPageContext } from 'next';
import { verify} from 'jsonwebtoken';
import cookie from 'cookie';
import { GUID } from '../libs/auth';
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
    user_id: string,
}
export const Nav = (props: NavProps)=> {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const stateChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
//     console.log(event.target.value);
// };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
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
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>

      <Button color="inherit"  style={{ flex: 1 }}>
          <Link href="/person">
            <a style={{ color: 'white' }}>
              <Typography  color="inherit">
                edit myself
              </Typography>
            </a>
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
}

Nav.getInitialProps = async (ctx: NextPageContext) =>{
  const str_cookie =ctx.req?.headers.cookie
  const ret_obj={}
  if(str_cookie){
    const mycookie = cookie.parse(str_cookie);

    const decode = verify(mycookie.auth, GUID).valueOf()
    Object.assign(ret_obj, decode)
    
  }
  return ret_obj
}