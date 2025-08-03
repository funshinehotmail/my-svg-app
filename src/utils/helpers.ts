import type { ContentInput, VisualSuggestion, Theme, ColorPalette } from '../types';
import { APP_CONFIG, ERROR_MESSAGES } from './constants';

// Content validation helpers
export const validateContent = (text: string): { isValid: boolean; error?: string } => {
  if (!text.trim()) {
    return { isValid: false, error: 'Content cannot be empty' };
  }
  
  if (text.length > APP_CONFIG.maxContentLength) {
    return { isValid: false, error: ERROR_MESSAGES.CONTENT_TOO_LONG };
  }
  
  return { isValid: true };
};

// ID generation
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Date formatting
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Color utilities
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const adjustColorBrightness = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const adjust = (color: number) => {
    const adjusted = Math.round(color * (100 + percent) / 100);
    return Math.max(0, Math.min(255, adjusted));
  };
  
  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
};

// Theme utilities
export const generateColorVariants = (baseColor: string): Record<string, string> => {
  return {
    50: adjustColorBrightness(baseColor, 90),
    100: adjustColorBrightness(baseColor, 80),
    200: adjustColorBrightness(baseColor, 60),
    300: adjustColorBrightness(baseColor, 40),
    400: adjustColorBrightness(baseColor, 20),
    500: baseColor,
    600: adjustColorBrightness(baseColor, -20),
    700: adjustColorBrightness(baseColor, -40),
    800: adjustColorBrightness(baseColor, -60),
    900: adjustColorBrightness(baseColor, -80),
  };
};

// Text processing utilities
export const extractKeywords = (text: string): string[] => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Remove common stop words
  const stopWords = new Set([
    'this', 'that', 'with', 'have', 'will', 'from', 'they', 'know',
    'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when',
    'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over',
    'such', 'take', 'than', 'them', 'well', 'were'
  ]);
  
  return [...new Set(words.filter(word => !stopWords.has(word)))];
};

export const detectDataPatterns = (text: string): { hasNumbers: boolean; hasPercentages: boolean; hasComparisons: boolean } => {
  const numberPattern = /\d+/g;
  const percentagePattern = /\d+%/g;
  const comparisonWords = /\b(vs|versus|compared|than|more|less|higher|lower|increase|decrease|growth|decline)\b/gi;
  
  return {
    hasNumbers: numberPattern.test(text),
    hasPercentages: percentagePattern.test(text),
    hasComparisons: comparisonWords.test(text),
  };
};

// File utilities
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Animation utilities
export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

export const animateValue = (
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void
): void => {
  const startTime = performance.now();
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    const currentValue = start + (end - start) * easedProgress;
    
    callback(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Local storage utilities
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
};

// Error handling utilities
export const createErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const logError = (error: unknown, context?: string): void => {
  const message = createErrorMessage(error);
  console.error(`${context ? `[${context}] ` : ''}${message}`, error);
};
