'use client';

import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function OneTapGoogle() {
  const router = useRouter();
  const supabase = createClient();

  async function generateNonce(): Promise<[string, string]> {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return [nonce, hashedNonce];
  }

  const initializeOneTap = async () => {
    if (typeof window === 'undefined' || !window.google?.accounts) return;

    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      return;
    }

    const [nonce, hashedNonce] = await generateNonce();

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response) => {
        try {
          const { error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
            nonce,
          });

          if (error) throw error;
          router.push('/');
        } catch (error) {
          console.error('Login failed', error);
        }
      },
      nonce: hashedNonce,
      use_fedcm_for_prompt: true,
    });

    window.google.accounts.id.prompt();
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initializeOneTap}
      />
    </>
  );
}
