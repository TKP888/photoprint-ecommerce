import { createClient } from "@/lib/supabase/client";
import type {
  AuthResponse,
  AuthTokenResponsePassword,
  ResetPasswordForEmailParams,
} from "@supabase/supabase-js";

/**
 * Sign up a user with email + password.
 */
export async function signUpWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const supabase = createClient();
  return supabase.auth.signUp({ email, password });
}

/**
 * Sign in an existing user via email + password.
 */
export async function signInWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthTokenResponsePassword> {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Request a password reset email.
 * Make sure the `redirectTo` matches your app’s reset page.
 */
export async function sendPasswordResetEmail({
  email,
  redirectTo,
}: ResetPasswordForEmailParams): Promise<{ error: Error | null }> {
  const supabase = createClient();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
}

/**
 * Sign the current user out.
 */
export async function signOut(): Promise<{ error: Error | null }> {
  const supabase = createClient();
  return supabase.auth.signOut();
}

/**
 * Helper for getting the current session (client-side).
 */
export async function getCurrentSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

/**
 * Helper for fetching the current user.
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}
