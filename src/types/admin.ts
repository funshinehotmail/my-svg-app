export interface AdminUser {
  id: string;
  user_id: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface NarrativeFlow {
  id: string;
  name: string;
  description: string;
  category: string;
  page_order: string[];
  metadata: Record<string, any>;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PageLayout {
  id: string;
  name: string;
  description: string;
  layout_type: string;
  layout_config: {
    columns: Array<{
      type: 'title' | 'content' | 'image' | 'chart';
      width: string;
      height?: string;
    }>;
  };
  preview_image?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface VisualMetaphor {
  id: string;
  name: string;
  description: string;
  metaphor_type: string;
  svg_content?: string;
  svg_url?: string;
  tags: string[];
  ai_description: string;
  usage_context?: string;
  color_variants: Array<{
    name: string;
    colors: Record<string, string>;
  }>;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SmartIcon {
  id: string;
  name: string;
  description: string;
  category: string;
  svg_content?: string;
  svg_url?: string;
  tags: string[];
  ai_description: string;
  keywords: string[];
  size_variants: Array<{
    name: string;
    size: number;
  }>;
  style_variants: Array<{
    name: string;
    style: string;
  }>;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PageComposition {
  id: string;
  narrative_flow_id: string;
  page_layout_id: string;
  visual_metaphor_id?: string;
  page_index: number;
  title: string;
  content_blocks: Array<{
    id: string;
    type: 'text' | 'image' | 'chart' | 'icon';
    content: any;
    position: { x: number; y: number; width: number; height: number };
  }>;
  icon_placements: Array<{
    icon_id: string;
    position: { x: number; y: number };
    size: string;
    style: string;
  }>;
  styling: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
    spacing: Record<string, number>;
  };
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SVGImport {
  id: string;
  source: string;
  source_id?: string;
  source_url?: string;
  name: string;
  description?: string;
  svg_content: string;
  tags: string[];
  license?: string;
  imported_by: string;
  imported_at: string;
}

// SVG Repo API types
export interface SVGRepoSearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
  download_url: string;
  tags: string[];
  license: string;
  preview_url: string;
}

export interface SVGRepoSearchResponse {
  results: SVGRepoSearchResult[];
  total: number;
  page: number;
  per_page: number;
}
