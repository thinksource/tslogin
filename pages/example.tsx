import React from 'react';

import { Formik } from 'formik';



export const BasicExample = () => (

  <div>

    <h1>My Form</h1>

    <Formik

      initialValues={{ name: 'jared' }}

      onSubmit={(values, actions) => {



        alert(JSON.stringify(values, null, 2));

        actions.setSubmitting(false);

    

      }}

    >

      {props => (

        <form onSubmit={props.handleSubmit}>

          <input

            type="text"

            onChange={props.handleChange}

            onBlur={props.handleBlur}

            value={props.values.name}

            name="name"

          />

          {props.errors.name && <div id="feedback">{props.errors.name}</div>}

          <button type="submit">Submit</button>

        </form>

      )}

    </Formik>

  </div>

);