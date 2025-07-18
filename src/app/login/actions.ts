'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data: SignInWithPasswordCredentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/resume', 'layout');
  redirect('/resume');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data: SignUpWithPasswordCredentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
