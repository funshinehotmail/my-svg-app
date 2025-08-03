import { supabase } from './supabase';
import type { 
  AdminUser, 
  NarrativeFlow, 
  PageLayout, 
  VisualMetaphor, 
  SmartIcon, 
  PageComposition, 
  SVGImport 
} from '../types/admin';

// Admin authentication helpers
export const adminAuth = {
  checkAdminStatus: async (): Promise<{ isAdmin: boolean; role?: string }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { isAdmin: false };

    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error || !adminUser) return { isAdmin: false };
    
    return { isAdmin: true, role: adminUser.role };
  },

  promoteToAdmin: async (userId: string, role: 'admin' | 'super_admin' = 'admin') => {
    const { data, error } = await supabase
      .from('admin_users')
      .upsert({
        user_id: userId,
        role,
        permissions: []
      })
      .select()
      .single();
    
    return { data, error };
  }
};

// Narrative flows management
export const narrativeFlowsDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('narrative_flows')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('narrative_flows')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  create: async (flow: Omit<NarrativeFlow, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('narrative_flows')
      .insert(flow)
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<NarrativeFlow>) => {
    const { data, error } = await supabase
      .from('narrative_flows')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('narrative_flows')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Page layouts management
export const pageLayoutsDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('page_layouts')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('page_layouts')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  create: async (layout: Omit<PageLayout, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('page_layouts')
      .insert(layout)
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<PageLayout>) => {
    const { data, error } = await supabase
      .from('page_layouts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('page_layouts')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Visual metaphors management
export const visualMetaphorsDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('visual_metaphors')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('visual_metaphors')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  search: async (query: string, type?: string) => {
    let queryBuilder = supabase
      .from('visual_metaphors')
      .select('*')
      .eq('is_active', true);

    if (query) {
      queryBuilder = queryBuilder.textSearch('name,description,ai_description', query);
    }

    if (type) {
      queryBuilder = queryBuilder.eq('metaphor_type', type);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });
    return { data, error };
  },

  create: async (metaphor: Omit<VisualMetaphor, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('visual_metaphors')
      .insert(metaphor)
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<VisualMetaphor>) => {
    const { data, error } = await supabase
      .from('visual_metaphors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('visual_metaphors')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Smart icons management
export const smartIconsDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('smart_icons')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('smart_icons')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  search: async (query: string, category?: string) => {
    let queryBuilder = supabase
      .from('smart_icons')
      .select('*')
      .eq('is_active', true);

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}},keywords.cs.{${query}}`);
    }

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });
    return { data, error };
  },

  create: async (icon: Omit<SmartIcon, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('smart_icons')
      .insert(icon)
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<SmartIcon>) => {
    const { data, error } = await supabase
      .from('smart_icons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('smart_icons')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Page compositions management
export const pageCompositionsDB = {
  getByFlowId: async (flowId: string) => {
    const { data, error } = await supabase
      .from('page_compositions')
      .select(`
        *,
        page_layout:page_layouts(*),
        visual_metaphor:visual_metaphors(*)
      `)
      .eq('narrative_flow_id', flowId)
      .order('page_index', { ascending: true });
    return { data, error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('page_compositions')
      .select(`
        *,
        page_layout:page_layouts(*),
        visual_metaphor:visual_metaphors(*)
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  create: async (composition: Omit<PageComposition, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('page_compositions')
      .insert(composition)
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<PageComposition>) => {
    const { data, error } = await supabase
      .from('page_compositions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('page_compositions')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// SVG imports management
export const svgImportsDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('svg_imports')
      .select('*')
      .order('imported_at', { ascending: false });
    return { data, error };
  },

  search: async (query: string, source?: string) => {
    let queryBuilder = supabase
      .from('svg_imports')
      .select('*');

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);
    }

    if (source) {
      queryBuilder = queryBuilder.eq('source', source);
    }

    const { data, error } = await queryBuilder.order('imported_at', { ascending: false });
    return { data, error };
  },

  create: async (svgImport: Omit<SVGImport, 'id' | 'imported_at'>) => {
    const { data, error } = await supabase
      .from('svg_imports')
      .insert(svgImport)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('svg_imports')
      .delete()
      .eq('id', id);
    return { error };
  }
};
