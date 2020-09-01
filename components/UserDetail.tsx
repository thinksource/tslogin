import * as React from 'react'

import { User } from '../src/entity/User'
import { Typography, InputLabel, NativeSelect, FormHelperText } from '@material-ui/core'
import { Formik, Form } from 'formik'
import { NextPageContext } from 'next'
import { useState } from 'react'

type ListDetailProps = {
  item: User
  authrole: string
}

const UserDetail = (props: ListDetailProps) => {
  const [role, setRole] = useState<string>(props.authrole);


  const handleChange = (event:React.ChangeEvent<{name?: string; value?: string}>) => {
    const name = event.target.name;
    if(name){
      setRole(name)
    }
  }
  return (<div>
    <Typography variant='h6'>
          Detail for {props.item.email}
    </Typography>
    <Formik  onSubmit ={async(_val, _formikHelpers) =>{}}  initialValues={props.item}>
      <Form>
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
      <p>password: {props.item.password}</p>
      </Form>
    </Formik> 
  </div>
  )
}

UserDetail.getInitialProps = async (ctx: NextPageContext) =>{
      const cookie = ctx.req?.headers.cookie;
  }

export default UserDetail
