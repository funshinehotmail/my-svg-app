import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContentInput, ContentAnalysis, VisualSuggestion, PresentationPage } from '../types';
import { aiService } from '../services/ai';
import { auth, db } from '../lib/supabase';

interface PresentationState {
  // Current presentation data
  currentPresentation: {
    id?: string;
    title: string;
    description?: string;
    contentInput?: ContentInput;
    contentAnalysis?: ContentAnalysis;
    visualSuggestions: VisualSuggestion[];
    selectedSuggestionId?: string;
    selectedTheme: string;
    status: 'draft' | 'processing' | 'completed' | 'error';
  };
  
  // Multi-page state
  pages: PresentationPage[];
  currentPageIndex: number;
  
  // UI state
  isAnalyzing: boolean;
  isLoading: boolean;
  error: string | null;
  
  // User presentations
  userPresentations: any[];
  
  // Actions
  setContentInput: (input: ContentInput) => void;
  analyzeContent: () => Promise<void>;
  setSelectedSuggestion: (suggestionId: string) => void;
  setSelectedTheme: (theme: string) => void;
  
  // Page management
  addPage: (page?: Partial<PresentationPage>) => void;
  updatePage: (index: number, updates: Partial<PresentationPage>) => void;
  deletePage: (index: number) => void;
  setCurrentPage: (index: number) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  
  // Persistence
  savePresentation: () => Promise<void>;
  loadPresentation: (id: string) => Promise<void>;
  loadUserPresentations: () => Promise<void>;
  deletePresentation: (id: string) => Promise<void>;
  
  // Reset
  reset: () => void;
}

const initialState = {
  currentPresentation: {
    title: 'Untitled Presentation',
    visualSuggestions: [],
    selectedTheme: 'modern',
    status: 'draft' as const
  },
  pages: [],
  currentPageIndex: 0,
  isAnalyzing: false,
  isLoading: false,
  error: null,
  userPresentations: []
};

export const usePresentationStore = create<PresentationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setContentInput: (input: ContentInput) => {
        set((state) => ({
          currentPresentation: {
            ...state.currentPresentation,
            contentInput: input,
            status: 'draft'
          },
          error: null
        }));
      },

      analyzeContent: async () => {
        const { currentPresentation } = get();
        
        if (!currentPresentation.contentInput) {
          set({ error: 'No content to analyze' });
          return;
        }

        set({ isAnalyzing: true, error: null });

        try {
          console.log('🔍 Starting AI content analysis...');
          const analysis = await aiService.analyzeContent(currentPresentation.contentInput);
          
          console.log('✅ AI analysis complete:', {
            suggestions: analysis.suggestions.length,
            keyPoints: analysis.extractedData.keyPoints.length
          });

          // Create initial pages from suggestions
          const initialPages: PresentationPage[] = analysis.suggestions.map((suggestion, index) => ({
            id: `page-${index}`,
            title: suggestion.title,
            content: suggestion.description,
            elements: suggestion.elements || [],
            visualType: suggestion.visualType,
            order: index
          }));

          set((state) => ({
            currentPresentation: {
              ...state.currentPresentation,
              contentAnalysis: analysis,
              visualSuggestions: analysis.suggestions,
              status: 'completed'
            },
            pages: initialPages,
            currentPageIndex: 0,
            isAnalyzing: false
          }));

          // Auto-save if user is authenticated
          const { user } = await auth.getCurrentUser();
          if (user) {
            await get().savePresentation();
          }

        } catch (error) {
          console.error('❌ AI analysis failed:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Analysis failed',
            isAnalyzing: false,
            currentPresentation: {
              ...currentPresentation,
              status: 'error'
            }
          });
        }
      },

      setSelectedSuggestion: (suggestionId: string) => {
        set((state) => ({
          currentPresentation: {
            ...state.currentPresentation,
            selectedSuggestionId: suggestionId
          }
        }));
      },

      setSelectedTheme: (theme: string) => {
        set((state) => ({
          currentPresentation: {
            ...state.currentPresentation,
            selectedTheme: theme
          }
        }));
      },

      addPage: (page = {}) => {
        const { pages } = get();
        const newPage: PresentationPage = {
          id: `page-${Date.now()}`,
          title: 'New Slide',
          content: '',
          elements: [],
          visualType: 'text',
          order: pages.length,
          ...page
        };

        set((state) => ({
          pages: [...state.pages, newPage],
          currentPageIndex: state.pages.length
        }));
      },

      updatePage: (index: number, updates: Partial<PresentationPage>) => {
        set((state) => ({
          pages: state.pages.map((page, i) => 
            i === index ? { ...page, ...updates } : page
          )
        }));
      },

      deletePage: (index: number) => {
        const { pages, currentPageIndex } = get();
        
        if (pages.length <= 1) return; // Don't delete the last page

        const newPages = pages.filter((_, i) => i !== index);
        const newCurrentIndex = currentPageIndex >= index && currentPageIndex > 0 
          ? currentPageIndex - 1 
          : currentPageIndex;

        set({
          pages: newPages,
          currentPageIndex: Math.min(newCurrentIndex, newPages.length - 1)
        });
      },

      setCurrentPage: (index: number) => {
        const { pages } = get();
        if (index >= 0 && index < pages.length) {
          set({ currentPageIndex: index });
        }
      },

      reorderPages: (fromIndex: number, toIndex: number) => {
        const { pages } = get();
        const newPages = [...pages];
        const [movedPage] = newPages.splice(fromIndex, 1);
        newPages.splice(toIndex, 0, movedPage);

        // Update order property
        newPages.forEach((page, index) => {
          page.order = index;
        });

        set({ pages: newPages });
      },

      savePresentation: async () => {
        const { currentPresentation, pages } = get();
        const { user } = await auth.getCurrentUser();
        
        if (!user) {
          console.warn('User not authenticated - cannot save to database');
          return;
        }

        set({ isLoading: true, error: null });

        try {
          let presentationId = currentPresentation.id;

          // Create or update presentation
          if (presentationId) {
            const { error } = await db.presentations.update(presentationId, {
              title: currentPresentation.title,
              description: currentPresentation.description,
              content_input: currentPresentation.contentInput,
              content_analysis: currentPresentation.contentAnalysis,
              visual_suggestions: currentPresentation.visualSuggestions,
              selected_suggestion_id: currentPresentation.selectedSuggestionId,
              selected_theme: currentPresentation.selectedTheme,
              status: currentPresentation.status
            });

            if (error) throw error;
          } else {
            const { data, error } = await db.presentations.create({
              user_id: user.id,
              title: currentPresentation.title,
              description: currentPresentation.description,
              content_input: currentPresentation.contentInput,
              content_analysis: currentPresentation.contentAnalysis,
              visual_suggestions: currentPresentation.visualSuggestions,
              selected_suggestion_id: currentPresentation.selectedSuggestionId,
              selected_theme: currentPresentation.selectedTheme,
              status: currentPresentation.status
            });

            if (error) throw error;
            presentationId = data.id;

            set((state) => ({
              currentPresentation: {
                ...state.currentPresentation,
                id: presentationId
              }
            }));
          }

          // Save pages
          for (const page of pages) {
            if (page.id.startsWith('page-') && !page.id.includes('-saved-')) {
              // Create new page
              await db.pages.create({
                presentation_id: presentationId,
                page_index: page.order,
                title: page.title,
                content: JSON.stringify({
                  content: page.content,
                  elements: page.elements,
                  visualType: page.visualType
                })
              });
            }
          }

          console.log('✅ Presentation saved successfully');
          
        } catch (error) {
          console.error('❌ Failed to save presentation:', error);
          set({ error: 'Failed to save presentation' });
        } finally {
          set({ isLoading: false });
        }
      },

      loadPresentation: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          // Load presentation
          const { data: presentation, error: presError } = await db.presentations.getById(id);
          if (presError) throw presError;

          // Load pages
          const { data: pages, error: pagesError } = await db.pages.getByPresentationId(id);
          if (pagesError) throw pagesError;

          const loadedPages: PresentationPage[] = pages.map(page => {
            const pageData = JSON.parse(page.content);
            return {
              id: page.id,
              title: page.title,
              content: pageData.content || '',
              elements: pageData.elements || [],
              visualType: pageData.visualType || 'text',
              order: page.page_index
            };
          });

          set({
            currentPresentation: {
              id: presentation.id,
              title: presentation.title,
              description: presentation.description || undefined,
              contentInput: presentation.content_input,
              contentAnalysis: presentation.content_analysis,
              visualSuggestions: presentation.visual_suggestions || [],
              selectedSuggestionId: presentation.selected_suggestion_id || undefined,
              selectedTheme: presentation.selected_theme || 'modern',
              status: presentation.status
            },
            pages: loadedPages,
            currentPageIndex: 0
          });

          console.log('✅ Presentation loaded successfully');
          
        } catch (error) {
          console.error('❌ Failed to load presentation:', error);
          set({ error: 'Failed to load presentation' });
        } finally {
          set({ isLoading: false });
        }
      },

      loadUserPresentations: async () => {
        const { user } = await auth.getCurrentUser();
        if (!user) return;

        try {
          const { data, error } = await db.presentations.getAll();
          if (error) throw error;

          set({ userPresentations: data || [] });
        } catch (error) {
          console.error('❌ Failed to load user presentations:', error);
        }
      },

      deletePresentation: async (id: string) => {
        try {
          const { error } = await db.presentations.delete(id);
          if (error) throw error;

          // Remove from local state
          set((state) => ({
            userPresentations: state.userPresentations.filter(p => p.id !== id)
          }));

          console.log('✅ Presentation deleted successfully');
        } catch (error) {
          console.error('❌ Failed to delete presentation:', error);
          set({ error: 'Failed to delete presentation' });
        }
      },

      reset: () => {
        set(initialState);
      }
    }),
    {
      name: 'presentation-store',
      partialize: (state) => ({
        currentPresentation: state.currentPresentation,
        pages: state.pages,
        currentPageIndex: state.currentPageIndex
      })
    }
  )
);
