// Import required modules
const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const firebase = require('firebase/app');
require('firebase/auth');

// Firebase configuration
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  // Add other Firebase config details
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Create an Express app
const app = express();

// Initialize Next.js
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
  // Render the React component for the homepage
  nextApp.render(req, res, '/', req.query);
});

app.get('/reset-password', (req, res) => {
  // Render the React component for the password reset page
  nextApp.render(req, res, '/reset-password', req.query);
});

// User sign-up route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Create user with email and password using Firebase Authentication
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    // Send email verification
    await userCredential.user.sendEmailVerification();
    res.status(200).json({ message: 'User signed up successfully. Check your email for verification.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Password reset route
app.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    res.status(200).json({ message: 'Password reset email sent. Check your email inbox.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the serverimport { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import firebase from 'firebase/app';
import 'firebase/auth';

const SignUpForm = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        setSuccessMessage(data.message);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      }
    },
  });

  return (
    <div>
      {successMessage && <div>{successMessage}</div>}
      {error && <div>Error: {error}</div>}
      <form onSubmit={formik.handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
        <input
          type="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;

const port = process.env.PORT || 3000;
nextApp.prepare().then(() => {
  app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server running on port ${port}`);
  });
}); 


import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import firebase from 'firebase/app';
import 'firebase/auth';

const PasswordResetForm = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      try {
        await firebase.auth().sendPasswordResetEmail(values.email);
        setSuccessMessage('Password reset email sent. Check your email inbox.');
      } catch (error) {
        setError(error.message);
      }
    },
  });

  return (
    <div>
      {successMessage && <div>{successMessage}</div>}
      {error && <div>Error: {error}</div>}
      <form onSubmit={formik.handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default PasswordResetForm;


import SignUpForm from '../components/SignUpForm';

const SignUpPage = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;

import PasswordResetForm from '../components/PasswordResetForm';

const ResetPasswordPage = () => {
  return (
    <div>
      <h1>Reset Password</h1>
      <PasswordResetForm />
    </div>
  );
};

export default ResetPasswordPage;


export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    // Your Firebase sign-up logic here
    res.status(200).json({ message: 'User signed up successfully' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}


export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    // Your Firebase password reset logic here
    res.status(200).json({ message: 'Password reset email sent' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}



