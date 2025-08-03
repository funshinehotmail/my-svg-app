export interface IconCategory {
  id: string;
  name: string;
  description: string;
  icons: IconDefinition[];
}

export interface IconDefinition {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  svgPath: string;
  viewBox?: string;
}

export class IconLibrary {
  private static instance: IconLibrary;
  private categories: IconCategory[] = [];
  
  static getInstance(): IconLibrary {
    if (!IconLibrary.instance) {
      IconLibrary.instance = new IconLibrary();
      IconLibrary.instance.initializeLibrary();
    }
    return IconLibrary.instance;
  }

  private initializeLibrary() {
    this.categories = [
      {
        id: 'business',
        name: 'Business & Finance',
        description: 'Icons for business, finance, and corporate content',
        icons: [
          {
            id: 'chart-bar',
            name: 'Bar Chart',
            category: 'business',
            keywords: ['chart', 'graph', 'data', 'analytics', 'statistics'],
            svgPath: 'M3 13l4-4 4 4 4-4v11H3v-7z M21 3v18H3'
          },
          {
            id: 'trending-up',
            name: 'Trending Up',
            category: 'business',
            keywords: ['growth', 'increase', 'profit', 'success', 'arrow'],
            svgPath: 'm22 7-8.5 8.5L9 11l-7 7 M22 7h-6 M22 7v6'
          },
          {
            id: 'dollar-sign',
            name: 'Dollar Sign',
            category: 'business',
            keywords: ['money', 'currency', 'finance', 'payment', 'cost'],
            svgPath: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'
          },
          {
            id: 'briefcase',
            name: 'Briefcase',
            category: 'business',
            keywords: ['work', 'job', 'career', 'professional', 'office'],
            svgPath: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M8 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4'
          },
          {
            id: 'target',
            name: 'Target',
            category: 'business',
            keywords: ['goal', 'objective', 'aim', 'focus', 'strategy'],
            svgPath: 'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z M12 6a6 6 0 1 0 0 12 6 6 0 1 0 0-12z M12 10a2 2 0 1 0 0 4 2 2 0 1 0 0-4z'
          }
        ]
      },
      {
        id: 'technology',
        name: 'Technology & Digital',
        description: 'Icons for technology, digital, and innovation content',
        icons: [
          {
            id: 'smartphone',
            name: 'Smartphone',
            category: 'technology',
            keywords: ['mobile', 'phone', 'device', 'app', 'digital'],
            svgPath: 'M5 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5z M12 18h.01'
          },
          {
            id: 'laptop',
            name: 'Laptop',
            category: 'technology',
            keywords: ['computer', 'device', 'work', 'technology', 'screen'],
            svgPath: 'M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16'
          },
          {
            id: 'wifi',
            name: 'WiFi',
            category: 'technology',
            keywords: ['internet', 'connection', 'network', 'wireless', 'signal'],
            svgPath: 'm1 9 2-2c4.97-4.97 13.03-4.97 18 0l2 2 M5 13l2-2c2.76-2.76 7.24-2.76 10 0l2 2 M9 17l2-2c.87-.87 2.13-.87 3 0l2 2 M12 21l.01.01'
          },
          {
            id: 'database',
            name: 'Database',
            category: 'technology',
            keywords: ['data', 'storage', 'server', 'information', 'cloud'],
            svgPath: 'M12 2c-4.97 0-9 1.79-9 4v12c0 2.21 4.03 4 9 4s9-1.79 9-4V6c0-2.21-4.03-4-9-4z M3 12c0 2.21 4.03 4 9 4s9-1.79 9-4 M3 18c0 2.21 4.03 4 9 4s9-1.79 9-4'
          },
          {
            id: 'code',
            name: 'Code',
            category: 'technology',
            keywords: ['programming', 'development', 'software', 'coding', 'tech'],
            svgPath: 'm16 18 6-6-6-6 M8 6l-6 6 6 6'
          }
        ]
      },
      {
        id: 'communication',
        name: 'Communication & Social',
        description: 'Icons for communication, social media, and interaction',
        icons: [
          {
            id: 'message-circle',
            name: 'Message Circle',
            category: 'communication',
            keywords: ['chat', 'message', 'communication', 'talk', 'conversation'],
            svgPath: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'
          },
          {
            id: 'users',
            name: 'Users',
            category: 'communication',
            keywords: ['people', 'team', 'group', 'community', 'social'],
            svgPath: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 1 0 0-8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75'
          },
          {
            id: 'mail',
            name: 'Mail',
            category: 'communication',
            keywords: ['email', 'message', 'contact', 'letter', 'send'],
            svgPath: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6'
          },
          {
            id: 'share',
            name: 'Share',
            category: 'communication',
            keywords: ['share', 'social', 'network', 'distribute', 'spread'],
            svgPath: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13'
          },
          {
            id: 'heart',
            name: 'Heart',
            category: 'communication',
            keywords: ['like', 'love', 'favorite', 'emotion', 'social'],
            svgPath: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'
          }
        ]
      },
      {
        id: 'education',
        name: 'Education & Learning',
        description: 'Icons for education, learning, and knowledge content',
        icons: [
          {
            id: 'book',
            name: 'Book',
            category: 'education',
            keywords: ['book', 'read', 'education', 'learning', 'knowledge'],
            svgPath: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20'
          },
          {
            id: 'graduation-cap',
            name: 'Graduation Cap',
            category: 'education',
            keywords: ['education', 'graduation', 'school', 'university', 'degree'],
            svgPath: 'M22 10v6M6 12H4a2 2 0 0 1 0-4h2 M18 12h2a2 2 0 0 0 0-4h-2 M12 3l8 5-8 5-8-5 8-5z M16 13v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4'
          },
          {
            id: 'lightbulb',
            name: 'Light Bulb',
            category: 'education',
            keywords: ['idea', 'innovation', 'creativity', 'solution', 'insight'],
            svgPath: 'M9 21h6 M12 3a6 6 0 0 0-6 6c0 1 .2 2 .6 2.8L9 15h6l2.4-3.2c.4-.8.6-1.8.6-2.8a6 6 0 0 0-6-6z'
          },
          {
            id: 'award',
            name: 'Award',
            category: 'education',
            keywords: ['achievement', 'success', 'recognition', 'certificate', 'winner'],
            svgPath: 'M12 15a7 7 0 1 0 0-14 7 7 0 1 0 0 14z M8.21 13.89L7 23l5-3 5 3-1.21-9.12'
          },
          {
            id: 'search',
            name: 'Search',
            category: 'education',
            keywords: ['search', 'find', 'research', 'explore', 'discover'],
            svgPath: 'm21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z'
          }
        ]
      },
      {
        id: 'health',
        name: 'Health & Wellness',
        description: 'Icons for health, medical, and wellness content',
        icons: [
          {
            id: 'heart-pulse',
            name: 'Heart Pulse',
            category: 'health',
            keywords: ['health', 'medical', 'heartbeat', 'pulse', 'wellness'],
            svgPath: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5 M12 5L8 21l4-7 4 7-4-16'
          },
          {
            id: 'activity',
            name: 'Activity',
            category: 'health',
            keywords: ['activity', 'fitness', 'exercise', 'health', 'movement'],
            svgPath: 'M22 12h-4l-3 9L9 3l-3 9H2'
          },
          {
            id: 'shield-check',
            name: 'Shield Check',
            category: 'health',
            keywords: ['protection', 'safety', 'security', 'health', 'insurance'],
            svgPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4'
          },
          {
            id: 'apple',
            name: 'Apple',
            category: 'health',
            keywords: ['nutrition', 'healthy', 'food', 'diet', 'wellness'],
            svgPath: 'M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z M10 2c1 .5 2 2 2 5'
          },
          {
            id: 'thermometer',
            name: 'Thermometer',
            category: 'health',
            keywords: ['temperature', 'health', 'medical', 'fever', 'measurement'],
            svgPath: 'M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z'
          }
        ]
      },
      {
        id: 'transportation',
        name: 'Transportation & Travel',
        description: 'Icons for transportation, travel, and logistics',
        icons: [
          {
            id: 'car',
            name: 'Car',
            category: 'transportation',
            keywords: ['car', 'vehicle', 'transport', 'travel', 'automotive'],
            svgPath: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 9H5.6L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2 M7 17a2 2 0 1 0 0 4 2 2 0 1 0 0-4z M17 17a2 2 0 1 0 0 4 2 2 0 1 0 0-4z'
          },
          {
            id: 'plane',
            name: 'Plane',
            category: 'transportation',
            keywords: ['airplane', 'flight', 'travel', 'aviation', 'transport'],
            svgPath: 'M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4s-2 0-3.5 1.5L12 9 4.8 6.2C3.5 5.5 2 6.5 2 8c0 .5.2.9.5 1.3L8 12l-3 3H2l3 3 3-3v-3l2.5 2.5c.4.3.8.5 1.3.5 1.5 0 2.5-1.5 1.8-2.8L17.8 19.2z'
          },
          {
            id: 'ship',
            name: 'Ship',
            category: 'transportation',
            keywords: ['ship', 'boat', 'maritime', 'ocean', 'transport'],
            svgPath: 'M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2c1.3 0 1.9-.5 2.5-1 M19 9V7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v2 M12 8V2l-2 2-2-2v6'
          },
          {
            id: 'truck',
            name: 'Truck',
            category: 'transportation',
            keywords: ['truck', 'delivery', 'logistics', 'shipping', 'transport'],
            svgPath: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2 M15 18H9 M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14 M7 18a2 2 0 1 0 0 4 2 2 0 1 0 0-4z M17 18a2 2 0 1 0 0 4 2 2 0 1 0 0-4z'
          },
          {
            id: 'map-pin',
            name: 'Map Pin',
            category: 'transportation',
            keywords: ['location', 'map', 'place', 'destination', 'navigation'],
            svgPath: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 7a3 3 0 1 0 0 6 3 3 0 1 0 0-6z'
          }
        ]
      }
    ];
  }

  getCategories(): IconCategory[] {
    return this.categories;
  }

  getCategory(categoryId: string): IconCategory | undefined {
    return this.categories.find(cat => cat.id === categoryId);
  }

  getIcon(iconId: string): IconDefinition | undefined {
    for (const category of this.categories) {
      const icon = category.icons.find(icon => icon.id === iconId);
      if (icon) return icon;
    }
    return undefined;
  }

  searchIcons(query: string): IconDefinition[] {
    const searchTerm = query.toLowerCase();
    const results: IconDefinition[] = [];

    for (const category of this.categories) {
      for (const icon of category.icons) {
        const matchesName = icon.name.toLowerCase().includes(searchTerm);
        const matchesKeywords = icon.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm)
        );
        const matchesCategory = category.name.toLowerCase().includes(searchTerm);

        if (matchesName || matchesKeywords || matchesCategory) {
          results.push(icon);
        }
      }
    }

    return results;
  }

  getIconsByCategory(categoryId: string): IconDefinition[] {
    const category = this.getCategory(categoryId);
    return category ? category.icons : [];
  }

  suggestIcons(keywords: string[]): IconDefinition[] {
    const suggestions: { icon: IconDefinition; score: number }[] = [];

    for (const category of this.categories) {
      for (const icon of category.icons) {
        let score = 0;
        
        for (const keyword of keywords) {
          const lowerKeyword = keyword.toLowerCase();
          
          // Exact name match gets highest score
          if (icon.name.toLowerCase() === lowerKeyword) {
            score += 10;
          }
          // Name contains keyword
          else if (icon.name.toLowerCase().includes(lowerKeyword)) {
            score += 5;
          }
          // Keyword match
          else if (icon.keywords.some(k => k.toLowerCase() === lowerKeyword)) {
            score += 8;
          }
          // Partial keyword match
          else if (icon.keywords.some(k => k.toLowerCase().includes(lowerKeyword))) {
            score += 3;
          }
          // Category match
          else if (category.name.toLowerCase().includes(lowerKeyword)) {
            score += 2;
          }
        }

        if (score > 0) {
          suggestions.push({ icon, score });
        }
      }
    }

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(s => s.icon);
  }

  renderIcon(iconId: string, size: number = 24, color: string = 'currentColor'): string {
    const icon = this.getIcon(iconId);
    if (!icon) return '';

    return `
      <svg 
        width="${size}" 
        height="${size}" 
        viewBox="${icon.viewBox || '0 0 24 24'}" 
        fill="none" 
        stroke="${color}" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="${icon.svgPath}" />
      </svg>
    `;
  }
}

export const iconLibrary = IconLibrary.getInstance();
