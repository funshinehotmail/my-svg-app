import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.warn('Error getting current user:', error);
      return null;
    }
    return user;
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Presentations
  getPresentation: async (id: string) => {
    const { data, error } = await supabase
      .from('presentations')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  getPresentations: async (userId: string) => {
    const { data, error } = await supabase
      .from('presentations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createPresentation: async (presentation: any) => {
    const { data, error } = await supabase
      .from('presentations')
      .insert(presentation)
      .select()
      .single();
    return { data, error };
  },

  updatePresentation: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('presentations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  deletePresentation: async (id: string) => {
    const { error } = await supabase
      .from('presentations')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Slides
  getSlides: async (presentationId: string) => {
    const { data, error } = await supabase
      .from('slides')
      .select('*')
      .eq('presentation_id', presentationId)
      .order('order_index', { ascending: true });
    return { data, error };
  },

  createSlide: async (slide: any) => {
    const { data, error } = await supabase
      .from('slides')
      .insert(slide)
      .select()
      .single();
    return { data, error };
  },

  updateSlide: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('slides')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  deleteSlide: async (id: string) => {
    const { error } = await supabase
      .from('slides')
      .delete()
      .eq('id', id);
    return { error };
  },

  // AI Cache
  aiCache: {
    get: async (contentHash: string) => {
      const { data, error } = await supabase
        .from('ai_cache')
        .select('*')
        .eq('content_hash', contentHash)
        .single();
      return { data, error };
    },

    set: async (contentHash: string, analysis: any) => {
      const { data, error } = await supabase
        .from('ai_cache')
        .upsert({
          content_hash: contentHash,
          analysis_result: analysis,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      return { data, error };
    }
  }
};
