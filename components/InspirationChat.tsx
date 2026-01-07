
import React, { useState, useRef, useEffect } from 'react';
import { generateDesignInspiration } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Sparkles, Loader2, User, Bot } from 'lucide-react';

const InspirationChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      const response = await generateDesignInspiration(input, history);
      setMessages(prev => [...prev, { role: 'model', text: response || 'AI 未返回任何响应。' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: '连接 AI 失败，请重试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm">
      <div className="p-4 border-b border-neutral-800 bg-neutral-900 flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Sparkles className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">AI 灵感引擎</h2>
          <p className="text-xs text-neutral-400">头脑风暴概念、材料与设计趋势</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
            <Bot className="w-12 h-12" />
            <div>
              <p className="text-lg font-medium">你好！我是你的设计小助手。</p>
              <p className="text-sm">试试说：“有哪些适合高端咖啡机的环保材料建议？”</p>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-neutral-800/80 border border-neutral-700'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-emerald-600/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-neutral-800/50 border border-neutral-700 w-32 h-10"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-neutral-900 border-t border-neutral-800">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="描述你的愿景或寻求建议..."
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-neutral-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspirationChat;
