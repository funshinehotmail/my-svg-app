import type { SVGRepoSearchResult, SVGRepoSearchResponse } from '../types/admin';

// SVG Repo API service
class SVGRepoService {
  private baseUrl = 'https://api.svgrepo.com/v1';
  private apiKey = import.meta.env.VITE_SVGREPO_API_KEY; // Optional API key for higher limits

  async search(query: string, page = 1, perPage = 20): Promise<SVGRepoSearchResponse> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        per_page: perPage.toString(),
        format: 'json'
      });

      if (this.apiKey) {
        params.append('api_key', this.apiKey);
      }

      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NapkinAI-Alternative/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`SVG Repo API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the response to match our interface
      return {
        results: data.icons?.map((icon: any) => ({
          id: icon.id.toString(),
          title: icon.title || icon.name,
          description: icon.description,
          url: icon.url,
          download_url: icon.download_url || `${this.baseUrl}/download/${icon.id}`,
          tags: icon.tags || [],
          license: icon.license || 'Unknown',
          preview_url: icon.preview_url || icon.url
        })) || [],
        total: data.total || 0,
        page: data.page || page,
        per_page: data.per_page || perPage
      };
    } catch (error) {
      console.error('SVG Repo search failed:', error);
      
      // Return mock data for development
      return this.getMockSearchResults(query, page, perPage);
    }
  }

  async downloadSVG(iconId: string): Promise<string> {
    try {
      const params = new URLSearchParams();
      if (this.apiKey) {
        params.append('api_key', this.apiKey);
      }

      const response = await fetch(`${this.baseUrl}/download/${iconId}?${params}`, {
        headers: {
          'Accept': 'image/svg+xml',
          'User-Agent': 'NapkinAI-Alternative/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`SVG download failed: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('SVG download failed:', error);
      
      // Return a placeholder SVG
      return this.getPlaceholderSVG(iconId);
    }
  }

  async getIconDetails(iconId: string): Promise<SVGRepoSearchResult | null> {
    try {
      const params = new URLSearchParams();
      if (this.apiKey) {
        params.append('api_key', this.apiKey);
      }

      const response = await fetch(`${this.baseUrl}/icons/${iconId}?${params}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NapkinAI-Alternative/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Icon details fetch failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        id: data.id.toString(),
        title: data.title || data.name,
        description: data.description,
        url: data.url,
        download_url: data.download_url || `${this.baseUrl}/download/${data.id}`,
        tags: data.tags || [],
        license: data.license || 'Unknown',
        preview_url: data.preview_url || data.url
      };
    } catch (error) {
      console.error('Icon details fetch failed:', error);
      return null;
    }
  }

  // Mock data for development/fallback
  private getMockSearchResults(query: string, page: number, perPage: number): SVGRepoSearchResponse {
    const mockIcons: SVGRepoSearchResult[] = [
      {
        id: 'mock-1',
        title: `${query} Icon 1`,
        description: `A beautiful ${query} icon for presentations`,
        url: 'https://www.svgrepo.com/show/1/icon.svg',
        download_url: 'https://www.svgrepo.com/download/1/icon.svg',
        tags: [query, 'business', 'presentation'],
        license: 'CC0',
        preview_url: 'https://www.svgrepo.com/show/1/icon.svg'
      },
      {
        id: 'mock-2',
        title: `${query} Icon 2`,
        description: `Another great ${query} icon`,
        url: 'https://www.svgrepo.com/show/2/icon.svg',
        download_url: 'https://www.svgrepo.com/download/2/icon.svg',
        tags: [query, 'design', 'ui'],
        license: 'MIT',
        preview_url: 'https://www.svgrepo.com/show/2/icon.svg'
      },
      {
        id: 'mock-3',
        title: `${query} Icon 3`,
        description: `Professional ${query} icon`,
        url: 'https://www.svgrepo.com/show/3/icon.svg',
        download_url: 'https://www.svgrepo.com/download/3/icon.svg',
        tags: [query, 'professional', 'clean'],
        license: 'Apache 2.0',
        preview_url: 'https://www.svgrepo.com/show/3/icon.svg'
      }
    ];

    return {
      results: mockIcons,
      total: mockIcons.length,
      page,
      per_page: perPage
    };
  }

  private getPlaceholderSVG(iconId: string): string {
    return `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="2"/>
        <text x="12" y="16" text-anchor="middle" font-family="Arial" font-size="10" fill="currentColor">
          ${iconId}
        </text>
      </svg>
    `;
  }
}

export const svgRepoService = new SVGRepoService();
