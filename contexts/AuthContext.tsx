import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase, getCurrentUser } from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { signInWithGoogle, signInWithApple } from "../lib/socialAuth";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    username: string,
    name: string
  ) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<{ success: boolean; error: any | null }>;
  signInWithApple: () => Promise<{ success: boolean; error: any | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setUser({ ...session.user, user_metadata: profile });
        } else {
          setUser(session.user);
        }
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);

        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            setUser({ ...session.user, user_metadata: profile });
          } else {
            setUser(session.user);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setUser({ ...session.user, user_metadata: profile });
        } else {
          setUser(session.user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    username: string,
    name: string
  ) => {
    try {
      // First, ensure username is included in the user metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: name,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name
            )}&background=random&color=fff`,
          },
        },
      });

      if (error) {
        return { error };
      }

      // Create a user profile in the profiles table with the username
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            username,
            full_name: name,
            email,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name
            )}&background=random&color=fff`,
            updated_at: new Date().toISOString(),
          },
        ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
          return { error: profileError };
        }
      }

      return { error: null };
    } catch (error: any) {
      console.error("Error in signUp:", error);
      return { error };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    refreshUserData,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
