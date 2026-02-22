import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Trash2 } from 'lucide-react';
import { HistoryItem } from '@/hooks/useHistory';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export function HistoryDrawer({ isOpen, onClose, history, onSelect, onClear }: HistoryDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0A0A0A] border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-white">Generation History</h2>
              </div>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {history.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No history yet.</p>
                  <p className="text-sm">Generate a page to see it here.</p>
                </div>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="w-full text-left bg-zinc-900/50 border border-white/5 hover:border-blue-500/50 hover:bg-zinc-900 transition-all rounded-xl p-4 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                        {item.params.pageType}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="font-medium text-white mb-1 truncate">{item.params.url}</h3>
                    <p className="text-xs text-zinc-500 truncate">{item.params.category}</p>
                  </button>
                ))
              )}
            </div>

            {history.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-white/5">
                <button
                  onClick={onClear}
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
