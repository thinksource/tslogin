import React, { useState } from 'react';
import { Typography, Button, Link } from '@material-ui/core';
import { Formik, Form, Field} from 'formik'
// import { mutate} from 'swr';

// import Axios, { Method } from 'axios';
import { useRouter } from 'next/router';
interface Props {
    previousPath: string
}
const LoginForm: React.FC<Props> = (loginData: Props)=>{
    // const emailRef = useRef<HTMLInputElement>(null);
    // const passRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<any>(null);
    const router = useRouter()

    return (
        <>
            <Typography variant="h3">
            Login
            </Typography>
            <Formik  onSubmit ={async(val, formikHelpers) =>{
                
                formikHelpers.setSubmitting(false)
                const resp = await fetch('http://localhost:3000/api/user/login', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(val)
                  });
                const myjson = await resp.json()
                if (myjson.message){
                    setMessage(myjson.message)
                }else{
                    const p=loginData.previousPath?loginData.previousPath:'/'
                    router.push(p)            
                }
            }}
            initialValues={{ email: '', password:'' }}
            >
                <Form>
                    <label htmlFor="message">{message}</label>
                    <label htmlFor="email">email:</label>
                    <Field name="email"></Field><br/>
                    <label htmlFor="password">password:</label>
                    <Field name='password' type="password"></Field><br/>
                    <Button type="submit" variant="contained" color="primary">Login</Button>
                    <Button variant="contained"><Link href ="/signup"><a>SignUp</a></Link></Button>
                </Form>
            </Formik>
        </>  
    )

}

export default LoginForm