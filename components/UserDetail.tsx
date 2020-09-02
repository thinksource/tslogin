import * as React from 'react'

import { User } from '../src/entity/User'
import { Typography, InputLabel, NativeSelect, FormHelperText, Portal,TextField, TextFieldProps, responsiveFontSizes } from '@material-ui/core'
import { Formik, Form } from 'formik'
import { NextPageContext } from 'next'
import { useState, useRef } from 'react'
import { decodeAuthCookie } from '../libs/auth'

type ListDetailProps = {
  item: User
  authrole: string
  cookie?: string
}

const UserDetail = (props: ListDetailProps) => {
    const [role, setRole] = useState<string>(props.authrole);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState<string>();
    const container = useRef(null);
    const oldpassword = useRef<TextFieldProps>(null);
    const newpassword = useRef<TextFieldProps>(null);
    const againpassword = useRef<TextFieldProps>(null);
    const handleClick = () => {
        setShow(!show);
        setMessage("");
      };
    const handleChange = (event:React.ChangeEvent<{name?: string; value?: string}>) => {
        const name = event.target.name;
        if(name){
        setRole(name)
        }
    }

    const handlePasswordChange = async ()=>{
        const newpass = newpassword.current?.value as string
        const agpass = againpassword.current?.value as string
        const oldpass = oldpassword.current?.value as string
        const UserId = props.item.id
        if(newpass !== agpass ){setMessage("the new password input do not match!")}
        else if(!UserId){setMessage("Do not login as user, please login again")}
        else{
        const data = { oldpass, newpass, id: UserId}
        const myresp = fetch('http://localhost:3000/api/user/resetpass', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': props.cookie?props.cookie:''
            },
            body: JSON.stringify(data)}).then(
                response=>{
                    if(!response.ok)setMessage("Update password not successful")
                    else setMessage("Update password!")
                }
            )
        }



    }
    return (<div>
    <Typography variant='h6'>
          Detail for {props.item.email}
    </Typography>
    <Formik  onSubmit ={async(_val, _formikHelpers) =>{}}  initialValues={props.item}>
      <Form>
    <label>{message}</label>
      <p>Your UserID: {props.item.id}</p>
      {role === "admin"
      ?(<>
        <InputLabel htmlFor="age-native-helper">Role</InputLabel>
        <NativeSelect
          value={role}
          onChange={handleChange}>
          <option aria-label="None" value="" />
          <option value="admin">Admin</option>
          <option value="active">Active</option>
          <option value="block">Block</option>
        </NativeSelect>
        <FormHelperText>Role Selected</FormHelperText>
        </>)
        :<p>Role: {props.item.role}</p>
      }
      <p><button type="button" onClick={handleClick}>
        {show ? 'Do not change password':'Change password'}
      </button></p>
      {show ? (
          <Portal container={container.current}>
            old password: <TextField inputRef={oldpassword} label="old password" type="password"/><br/>
            new password: <TextField inputRef={newpassword} label="new password" type="password"/><br/>
            new password: <TextField inputRef={againpassword} label="new password again" type="password"/><br/>
            <button onClick={handlePasswordChange}>submit</button>
          </Portal>
        ) : null}
      </Form>
    </Formik> 
  </div>
  )
}

UserDetail.getInitialProps = async (ctx: NextPageContext) =>{
    const cookie = ctx.req?.headers.cookie;
    return {cookie}
}

export default UserDetail
