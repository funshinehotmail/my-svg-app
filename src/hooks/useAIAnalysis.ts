import { useState, useCallback } from 'react';
import { mockAIService } from '../services/ai/mockAIService';
import type { ContentInput, ContentAnalysis } from '../types';

interface UseAIAnalysisReturn {
  analyzeContent: (content: ContentInput) => Promise<ContentAnalysis | null>;
  analysis: ContentAnalysis | null;
  loading: boolean;
  error: string | null;
  clearAnalysis: () => void;
}

export const useAIAnalysis = (): UseAIAnalysisReturn => {
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeContent = useCallback(async (content: ContentInput): Promise<ContentAnalysis | null> => {
    if (!content.content.trim()) {
      setError('Content cannot be empty');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await mockAIService.analyzeContent(content);
      setAnalysis(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze content';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analyzeContent,
    analysis,
    loading,
    error,
    clearAnalysis
  };
};
