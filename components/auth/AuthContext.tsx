"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  getCurrentSession,
  getCurrentUser,
  signInWithEmail,
  signOut,
  signUpWithEmail,
  sendPasswordResetEmail,
} from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
import type {
  Session,
  User,
  AuthResponse,
  AuthTokenResponsePassword,
} from "@supabase/supabase-js";

type AuthContextValue = {
  user: User | null | undefined;
  session: Session | null | undefined;
  loading: boolean;
  signUp: typeof signUpWithEmail;
  signIn: typeof signInWithEmail;
  signOut: typeof signOut;
  sendResetEmail: typeof sendPasswordResetEmail;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>();
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const [{ user: currentUser }, { session: currentSession }] =
        await Promise.all([getCurrentUser(), getCurrentSession()]);

      if (!mounted) return;
      setUser(currentUser ?? null);
      setSession(currentSession ?? null);
      setLoading(false);
    };

    init();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signUp: signUpWithEmail,
      signIn: signInWithEmail,
      signOut,
      sendResetEmail: sendPasswordResetEmail,
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
