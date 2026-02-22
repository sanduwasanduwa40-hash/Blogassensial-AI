import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratorParams, generatePageContent } from '@/services/gemini';
import { getQuickTip } from '@/services/ai-extras';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { ChatBot } from '@/components/ChatBot';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { useHistory, HistoryItem } from '@/hooks/useHistory';
import { cn } from '@/lib/utils';
import { Loader2, Check, Copy, Eye, Code, ArrowRight, Sparkles, AlertCircle, Zap, Clock } from 'lucide-react';

const CATEGORIES = [
  "Insurance", "Cryptocurrency", "Health & Fitness", "Real Estate", "Digital Marketing",
  "Online Learning", "Automobile", "Make Money Online", "Personal Finance", "Online Banking",
  "Legal", "Travel & Accommodation", "Blogging", "Web Development", "Web Hosting",
  "Food", "Lifestyle", "Fashion & Beauty", "Photography", "Personal", "DIY Craft",
  "Parenting", "Music", "Business", "Art & Design", "Books & Writing", "Interior Design",
  "Sports", "News", "Movies", "Religion", "Political"
].sort();

const PAGE_TYPES = [
  "About Us",
  "Contact Us",
  "Privacy Policy",
  "Disclaimer",
  "Terms & Conditions",
  "Help / FAQ",
  "Affiliate Disclosure"
];

export default function App() {
  const [formData, setFormData] = useState<GeneratorParams>({
    url: '',
    description: '',
    pageType: PAGE_TYPES[0],
    category: CATEGORIES[0],
    customInfo: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [metaDescription, setMetaDescription] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [error, setError] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { history, addToHistory, clearHistory } = useHistory();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url || !formData.description) {
      setError("Please fill in all required fields.");
      return;
    }
    
    setError(null);
    setIsGenerating(true);
    setGeneratedCode(null);
    setMetaDescription(null);

    try {
      const result = await generatePageContent(formData);
      setGeneratedCode(result.html);
      setMetaDescription(result.metaDescription);
      addToHistory(formData, result);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setFormData(item.params);
    setGeneratedCode(item.content.html);
    setMetaDescription(item.content.metaDescription);
    setError(null);
  };

  const handleGetTip = async () => {
    setLoadingTip(true);
    try {
      const newTip = await getQuickTip(formData.category);
      setTip(newTip);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTip(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      // Could add a toast here
    }
  };

  const copyMetaToClipboard = () => {
    if (metaDescription) {
      navigator.clipboard.writeText(metaDescription);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 selection:text-white">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center space-y-6 relative"
        >
          <div className="absolute right-0 top-0 hidden md:block">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsHistoryOpen(true)}
              className="gap-2"
            >
              <Clock className="w-4 h-4" />
              History
            </Button>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <span>AdSense Optimized Generator</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
            Blogassensial AI
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            Generate production-ready, SEO-optimized essential pages for your Blogger site in seconds.
          </p>
          
          <div className="md:hidden flex justify-center mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsHistoryOpen(true)}
              className="gap-2"
            >
              <Clock className="w-4 h-4" />
              History
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-500 rounded-full"/>
                      Configuration
                    </h2>
                    <button
                      type="button"
                      onClick={handleGetTip}
                      disabled={loadingTip}
                      className="text-xs flex items-center gap-1 text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      <Zap className="w-3 h-3" />
                      {loadingTip ? "..." : "Get SEO Tip"}
                    </button>
                  </div>

                  {tip && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs text-yellow-500/80 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20"
                    >
                      "{tip}"
                    </motion.div>
                  )}
                  
                  <Input 
                    label="Blogger URL" 
                    placeholder="https://yourblog.blogspot.com"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    required
                  />
                  
                  <Select 
                    label="Category"
                    options={CATEGORIES.map(c => ({ value: c, label: c }))}
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />

                  <Select 
                    label="Page Type"
                    options={PAGE_TYPES.map(t => ({ value: t, label: t }))}
                    value={formData.pageType}
                    onChange={(e) => setFormData({...formData, pageType: e.target.value})}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full"/>
                    Content Details
                  </h2>
                  
                  <Textarea 
                    label="Blog Description"
                    placeholder="Describe your blog's mission, audience, and value proposition..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows={4}
                  />

                  <Textarea 
                    label="Custom Info (Optional)"
                    placeholder="Any specific details to include (e.g., email address, company name)..."
                    value={formData.customInfo}
                    onChange={(e) => setFormData({...formData, customInfo: e.target.value})}
                    rows={2}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg bg-white text-black hover:bg-gray-200"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Site
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Preview/Output */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8"
          >
            <div className="h-full flex flex-col bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 min-h-[600px]">
              
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/5">
                  <button
                    onClick={() => setViewMode('preview')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                      viewMode === 'preview' ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                    )}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                      viewMode === 'code' ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                    )}
                  >
                    <Code className="w-4 h-4" />
                    Code
                  </button>
                </div>

                {generatedCode && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy HTML
                  </Button>
                )}
              </div>

              {/* Content Area */}
              <div className="flex-1 relative bg-white flex flex-col">
                {metaDescription && (
                  <div className="bg-zinc-100 border-b border-zinc-200 p-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        SEO Meta Description
                      </div>
                      <p className="text-sm text-zinc-800 leading-relaxed font-medium">
                        {metaDescription}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={copyMetaToClipboard}
                      className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 shrink-0 h-8 w-8 p-0"
                      title="Copy Meta Description"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex-1 relative">
                  {!generatedCode ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 bg-[#0A0A0A]">
                      {isGenerating ? (
                        <div className="text-center space-y-4">
                          <div className="relative w-20 h-20 mx-auto">
                            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                          </div>
                          <p className="text-lg font-medium text-white">Crafting your page...</p>
                          <p className="text-sm text-zinc-500">Optimizing for SEO and AdSense</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-4 max-w-md px-6">
                          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto border border-zinc-800">
                            <Sparkles className="w-8 h-8 text-zinc-600" />
                          </div>
                          <h3 className="text-xl font-medium text-white">Ready to Generate</h3>
                          <p className="text-zinc-500">
                            Fill out the form on the left to generate your professional Blogger page.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {viewMode === 'preview' ? (
                        <iframe 
                          srcDoc={generatedCode}
                          className="w-full h-full border-none bg-white"
                          title="Preview"
                          sandbox="allow-same-origin"
                        />
                      ) : (
                        <div className="absolute inset-0 overflow-auto bg-[#1e1e1e] text-zinc-300 p-6 font-mono text-sm">
                          <pre className="whitespace-pre-wrap break-all">
                            {generatedCode}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <ChatBot />
      <HistoryDrawer 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onSelect={handleRestoreHistory}
        onClear={clearHistory}
      />
    </div>
  );
}
