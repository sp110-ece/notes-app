'use client'

import { signIn, confirmSignIn, confirmSignUp } from '@aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from '@/lib/amplifyConfig';

import { sign } from 'crypto';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth'

Amplify.configure(amplifyConfig);

const AuthButtons = () => {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const tempUser = await getCurrentUser();
        if (tempUser) {
          router.push('/dashboard');
        }
      } catch (err) {
      }
    };
    checkUser();
  }, [router]);

  const handleSignIn = async () => {
    try {
      const user = await signIn({username, password});
    router.push('/dashboard'); 
      setUser(user);
  } catch (err: any) {
    if (err.message.includes("Incorrect username or password")) {
      setError("Invalid credentials. Please check your username and password.");
    } else if (err.message.includes("Password attempts exceeded")) {
      setError("Too many failed attempts. Please wait or reset your password.");
    } else if (err.message.includes("CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED")) {
      setError("New password required. Please update your password.");
      const updatedUser = await confirmSignIn({
        challengeResponse: password, 
      });
      setUser(updatedUser);
    } else {
      setError(err.message || "Sign-in failed.");
    }
  }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <div className='flex flex-col space-y-2'>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn} className="text-blue-600 hover:bg-[var(--color-accent-light)]" style={{ padding: '0.5rem 0.5rem', marginTop: '0.5rem', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Sign In</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default AuthButtons;

