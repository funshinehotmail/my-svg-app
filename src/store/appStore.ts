import { create } from 'zustand';
import type { 
  ContentInput, 
  VisualSuggestion, 
  WorkflowStep, 
  UserPreferences,
  ContentAnalysis,
  EditorPage 
} from '../types';
import { type ThemeId } from '../utils/constants';

interface AppState {
  // Workflow
  currentStep: WorkflowStep;
  
  // Content
  content: ContentInput | null;
  contentAnalysis: ContentAnalysis | null;
  
  // Visual suggestions
  visualSuggestions: VisualSuggestion[];
  selectedSuggestion: VisualSuggestion | null;
  
  // Theme
  selectedTheme: ThemeId | null;
  
  // Editor pages
  editorPages: EditorPage[];
  currentPageIndex: number;
  
  // UI state
  loading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  
  // User preferences
  userPreferences: UserPreferences;
}

interface AppActions {
  // Workflow actions
  setCurrentStep: (step: WorkflowStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Content actions
  setContent: (content: ContentInput) => void;
  setContentAnalysis: (analysis: ContentAnalysis) => void;
  clearContent: () => void;
  
  // Visual suggestion actions
  setVisualSuggestions: (suggestions: VisualSuggestion[]) => void;
  setSelectedSuggestion: (suggestion: VisualSuggestion | null) => void;
  addVisualSuggestion: (suggestion: VisualSuggestion) => void;
  
  // Theme actions
  setSelectedTheme: (theme: ThemeId | null) => void;
  
  // Editor page actions
  addPage: (page?: Partial<EditorPage>) => void;
  removePage: (index: number) => void;
  duplicatePage: (index: number) => void;
  setCurrentPageIndex: (index: number) => void;
  updatePageContent: (index: number, content: string) => void;
  updatePageTitle: (index: number, title: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  
  // User preferences
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Reset
  reset: () => void;
}

const workflowSteps: WorkflowStep[] = ['input', 'processing', 'preview', 'editing', 'export'];

const createInitialPage = (selectedSuggestion: VisualSuggestion | null): EditorPage => {
  let content = '<h1>New Presentation</h1>';
  
  if (selectedSuggestion) {
    content = `<h1>${selectedSuggestion.title}</h1>`;
    
    selectedSuggestion.elements?.forEach((element) => {
      switch (element.type) {
        case 'text':
          content += `<p>${element.content}</p>`;
          break;
        case 'chart':
          content += `<div class="chart-placeholder bg-gray-100 p-8 rounded-lg text-center my-4">
            <h3>${element.title || 'Chart'}</h3>
            <p class="text-gray-600">Interactive ${element.chartType} chart will be rendered here</p>
          </div>`;
          break;
        case 'diagram':
          content += `<div class="diagram-placeholder bg-blue-50 p-8 rounded-lg text-center my-4">
            <h3>${element.title || 'Diagram'}</h3>
            <p class="text-gray-600">${element.description || 'Visual diagram'}</p>
          </div>`;
          break;
        case 'list':
          const items = Array.isArray(element.items) ? element.items : ['Item 1', 'Item 2', 'Item 3'];
          content += `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
          break;
        case 'image':
          content += `<img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" alt="${element.alt || 'Visual element'}" />`;
          break;
      }
    });
  }

  return {
    id: `page-${Date.now()}`,
    title: selectedSuggestion?.title || 'Slide 1',
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

const initialState: AppState = {
  currentStep: 'input',
  content: null,
  contentAnalysis: null,
  visualSuggestions: [],
  selectedSuggestion: null,
  selectedTheme: null,
  editorPages: [],
  currentPageIndex: 0,
  loading: false,
  error: null,
  sidebarOpen: true,
  userPreferences: {
    defaultTheme: 'professional',
    autoSave: true,
    showTips: true
  }
};

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  ...initialState,
  
  // Workflow actions
  setCurrentStep: (step) => set({ currentStep: step }),
  
  nextStep: () => {
    const { currentStep } = get();
    const currentIndex = workflowSteps.indexOf(currentStep);
    if (currentIndex < workflowSteps.length - 1) {
      set({ currentStep: workflowSteps[currentIndex + 1] });
    }
  },
  
  previousStep: () => {
    const { currentStep } = get();
    const currentIndex = workflowSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: workflowSteps[currentIndex - 1] });
    }
  },
  
  // Content actions
  setContent: (content) => set({ content }),
  
  setContentAnalysis: (analysis) => set({ contentAnalysis: analysis }),
  
  clearContent: () => set({ 
    content: null, 
    contentAnalysis: null,
    visualSuggestions: [],
    selectedSuggestion: null,
    selectedTheme: null,
    editorPages: [],
    currentPageIndex: 0
  }),
  
  // Visual suggestion actions
  setVisualSuggestions: (suggestions) => set({ visualSuggestions: suggestions }),
  
  setSelectedSuggestion: (suggestion) => {
    const { editorPages } = get();
    set({ 
      selectedSuggestion: suggestion,
      // Initialize first page if no pages exist
      editorPages: editorPages.length === 0 ? [createInitialPage(suggestion)] : editorPages
    });
  },
  
  addVisualSuggestion: (suggestion) => {
    const { visualSuggestions } = get();
    set({ visualSuggestions: [...visualSuggestions, suggestion] });
  },
  
  // Theme actions
  setSelectedTheme: (theme) => set({ selectedTheme: theme }),
  
  // Editor page actions
  addPage: (pageData = {}) => {
    const { editorPages, selectedSuggestion } = get();
    const newPage: EditorPage = {
      id: `page-${Date.now()}`,
      title: `Slide ${editorPages.length + 1}`,
      content: '<h1>New Slide</h1><p>Start editing your content here...</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...pageData
    };
    
    set({ 
      editorPages: [...editorPages, newPage],
      currentPageIndex: editorPages.length
    });
  },
  
  removePage: (index) => {
    const { editorPages, currentPageIndex } = get();
    if (editorPages.length <= 1) return; // Don't remove the last page
    
    const newPages = editorPages.filter((_, i) => i !== index);
    const newCurrentIndex = currentPageIndex >= index && currentPageIndex > 0 
      ? currentPageIndex - 1 
      : currentPageIndex;
    
    set({ 
      editorPages: newPages,
      currentPageIndex: Math.min(newCurrentIndex, newPages.length - 1)
    });
  },
  
  duplicatePage: (index) => {
    const { editorPages } = get();
    const pageToDuplicate = editorPages[index];
    if (!pageToDuplicate) return;
    
    const duplicatedPage: EditorPage = {
      ...pageToDuplicate,
      id: `page-${Date.now()}`,
      title: `${pageToDuplicate.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newPages = [
      ...editorPages.slice(0, index + 1),
      duplicatedPage,
      ...editorPages.slice(index + 1)
    ];
    
    set({ 
      editorPages: newPages,
      currentPageIndex: index + 1
    });
  },
  
  setCurrentPageIndex: (index) => {
    const { editorPages } = get();
    if (index >= 0 && index < editorPages.length) {
      set({ currentPageIndex: index });
    }
  },
  
  updatePageContent: (index, content) => {
    const { editorPages } = get();
    const newPages = editorPages.map((page, i) => 
      i === index 
        ? { ...page, content, updatedAt: new Date().toISOString() }
        : page
    );
    set({ editorPages: newPages });
  },
  
  updatePageTitle: (index, title) => {
    const { editorPages } = get();
    const newPages = editorPages.map((page, i) => 
      i === index 
        ? { ...page, title, updatedAt: new Date().toISOString() }
        : page
    );
    set({ editorPages: newPages });
  },
  
  reorderPages: (fromIndex, toIndex) => {
    const { editorPages, currentPageIndex } = get();
    const newPages = [...editorPages];
    const [movedPage] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, movedPage);
    
    // Update current page index if needed
    let newCurrentIndex = currentPageIndex;
    if (currentPageIndex === fromIndex) {
      newCurrentIndex = toIndex;
    } else if (currentPageIndex > fromIndex && currentPageIndex <= toIndex) {
      newCurrentIndex = currentPageIndex - 1;
    } else if (currentPageIndex < fromIndex && currentPageIndex >= toIndex) {
      newCurrentIndex = currentPageIndex + 1;
    }
    
    set({ 
      editorPages: newPages,
      currentPageIndex: newCurrentIndex
    });
  },
  
  // UI actions
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // User preferences
  updateUserPreferences: (preferences) => {
    const { userPreferences } = get();
    set({ userPreferences: { ...userPreferences, ...preferences } });
  },
  
  // Reset
  reset: () => set(initialState)
}));
