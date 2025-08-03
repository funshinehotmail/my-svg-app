import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppState, ContentInput, VisualSuggestion, Theme, Slide, Presentation, ExportStatus, AIAnalysisResult } from '../types';

interface AppActions {
  // Content actions
  setCurrentContent: (content: ContentInput) => void;
  addToContentHistory: (content: ContentInput) => void;
  clearContent: () => void;
  
  // AI analysis actions
  setAIAnalysis: (analysis: AIAnalysisResult) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  
  // Visual suggestions actions
  setSuggestions: (suggestions: VisualSuggestion[]) => void;
  setSelectedSuggestion: (suggestion: VisualSuggestion | null) => void;
  setIsGeneratingVisuals: (isGenerating: boolean) => void;
  
  // Theme actions
  setAvailableThemes: (themes: Theme[]) => void;
  setSelectedTheme: (theme: Theme | null) => void;
  
  // Editor actions
  setCurrentSlide: (slide: Slide | null) => void;
  setPresentation: (presentation: Presentation | null) => void;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  
  // Export actions
  setExportStatus: (status: ExportStatus | null) => void;
  addToExportHistory: (status: ExportStatus) => void;
  
  // UI actions
  setActiveStep: (step: AppState['activeStep']) => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Reset actions
  resetState: () => void;
}

const initialState: AppState = {
  // Content state
  currentContent: null,
  contentHistory: [],
  
  // AI analysis state
  aiAnalysis: null,
  isAnalyzing: false,
  analysisError: null,
  
  // Visual suggestions state
  suggestions: [],
  selectedSuggestion: null,
  isGeneratingVisuals: false,
  
  // Theme state
  availableThemes: [],
  selectedTheme: null,
  
  // Editor state
  currentSlide: null,
  presentation: null,
  editorHistory: [],
  
  // Export state
  exportStatus: null,
  exportHistory: [],
  
  // UI state
  activeStep: 'input',
  sidebarOpen: true,
  loading: false,
  error: null,
};

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Content actions
      setCurrentContent: (content) => set({ currentContent: content }),
      addToContentHistory: (content) => set((state) => ({
        contentHistory: [content, ...state.contentHistory.slice(0, 9)] // Keep last 10
      })),
      clearContent: () => set({ currentContent: null }),
      
      // AI analysis actions
      setAIAnalysis: (analysis) => set({ aiAnalysis: analysis }),
      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
      setAnalysisError: (error) => set({ analysisError: error }),
      
      // Visual suggestions actions
      setSuggestions: (suggestions) => set({ suggestions }),
      setSelectedSuggestion: (suggestion) => set({ selectedSuggestion: suggestion }),
      setIsGeneratingVisuals: (isGenerating) => set({ isGeneratingVisuals: isGenerating }),
      
      // Theme actions
      setAvailableThemes: (themes) => set({ availableThemes: themes }),
      setSelectedTheme: (theme) => set({ selectedTheme: theme }),
      
      // Editor actions
      setCurrentSlide: (slide) => set({ currentSlide: slide }),
      setPresentation: (presentation) => set({ presentation }),
      updateSlide: (slideId, updates) => set((state) => {
        if (!state.presentation) return state;
        
        const updatedSlides = state.presentation.slides.map(slide =>
          slide.id === slideId ? { ...slide, ...updates, updatedAt: new Date() } : slide
        );
        
        return {
          presentation: {
            ...state.presentation,
            slides: updatedSlides,
            metadata: {
              ...state.presentation.metadata,
              updatedAt: new Date(),
              version: state.presentation.metadata.version + 1
            }
          }
        };
      }),
      
      // Export actions
      setExportStatus: (status) => set({ exportStatus: status }),
      addToExportHistory: (status) => set((state) => ({
        exportHistory: [status, ...state.exportHistory.slice(0, 19)] // Keep last 20
      })),
      
      // UI actions
      setActiveStep: (step) => set({ activeStep: step }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Reset actions
      resetState: () => set(initialState),
    }),
    {
      name: 'napkin-ai-store',
    }
  )
);
