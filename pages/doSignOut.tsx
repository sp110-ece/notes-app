'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@aws-amplify/auth';

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button onClick={handleSignOut} style={{ padding: '0.5rem 0.5rem', border: 'none', borderRadius: '1px', cursor: 'pointer', verticalAlign: 'center', color: 'var(--color-foreground)', backgroundColor: 'var(--color-button-bg)'}}>
      Sign Out
    </button>
  );
};

export default SignOut;
