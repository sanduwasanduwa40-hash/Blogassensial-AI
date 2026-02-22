import { useState, useEffect } from 'react';
import { GeneratorParams, GeneratedContent } from '@/services/gemini';

export interface HistoryItem {
  id: string;
  timestamp: number;
  params: GeneratorParams;
  content: GeneratedContent;
}

const STORAGE_KEY = 'blogassensial_history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const addToHistory = (params: GeneratorParams, content: GeneratedContent) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      params,
      content
    };
    
    // Check if identical params already exist at the top to avoid duplicates
    if (history.length > 0) {
      const lastItem = history[0];
      if (JSON.stringify(lastItem.params) === JSON.stringify(params) && 
          lastItem.content.html === content.html) {
        return;
      }
    }

    const newHistory = [newItem, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addToHistory, clearHistory };
}
