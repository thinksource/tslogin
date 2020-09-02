import React, {useState, FormEvent} from 'react';
import Router from 'next/router';


const Signup = () => {
  const [signupError, setSignupError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    fetch('/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        passwordConfirmation
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.error) {
          setSignupError(data.message);
        }
        if (data && data.token) {
          //set cookie
          console.log(data)
          //cookie.set('token', data.token, {expires: 2});
          Router.push('/login');
        }
      });
  }
  return (
    
    <form onSubmit={handleSubmit}>
      <p>Sign Up</p>
      <label>{signupError}</label>
      <label htmlFor="email">
        email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          type="email"
        />
      </label>

      <br />

      <label>
        password
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          type="password"
        />
      </label>
      <br />
      <label>
        password again:
        <input
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          name="password"
          type="password"
        />
      </label>

      <br />

      <input type="submit" value="SignUp" />
      {signupError && <p style={{color: 'red'}}>{signupError}</p>}
    </form>
  );
};

export default Signup;