'use client'

import { useState } from 'react'
import { signUp, confirmSignUp } from '@aws-amplify/auth'
import AuthButtons from './AuthButtons'

const DoSignUp = () => {
  const [signUpMode, setSignUpMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'confirm'>('form');

    const handleSignUp = async () => {
        try {
            await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        email,
                        name: username
                    },
                },
            });
            setStep('confirm');
            setError('');
        }
        catch (err) {
            setError('Sign up failed' + (err as any)?.message);
        }
    };

    const handleConfirm = async () => {
    try {
      await confirmSignUp({ username, confirmationCode });
      setStep('form');
      setSignUpMode(false);
      setError('');
    } catch (err) {
        setError('Confirmation failed. ' + (err as any)?.message);
    }
    };
    return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h1>We're happy you're here!</h1>

      {signUpMode ? (
        step === 'form' ? (
          <div className="flex flex-col">
            <h2>Sign Up</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            /><br />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            /><br />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            /><br />
            <button 
            style={{color: 'black'}}
            onClick={handleSignUp}>Sign Up</button>
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setSignUpMode(false)}
                className="appearance-none bg-transparent border-none p-0 m-0 text-blue-600 hover:underline font-medium cursor-pointer"
                style={{ backgroundColor: 'transparent', color: 'var(--color-muted)', boxShadow: 'none' }}
              >
                Sign In
              </button>
            </p>
          </div>
        ) : (
          <>
            <h2>Confirm Your Email</h2>
            <input
              type="text"
              placeholder="Confirmation Code"
              value={confirmationCode}
              onChange={e => setConfirmationCode(e.target.value)}
            /><br />
            <button onClick={handleConfirm}>Confirm</button>
          </>
        )
      ) : (
        <>
          <AuthButtons />
          <br></br>
          <p>
            Don’t have an account?{' '}
            <button
              onClick={() => setSignUpMode(true)}
              type="button"
              className="text-blue-600 hover:underline font-medium focus:outline-none"
              style={{ backgroundColor: 'transparent', color: 'var(--color-muted)', boxShadow: 'none' }}  
            >
              Sign Up
            </button>
          </p>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DoSignUp