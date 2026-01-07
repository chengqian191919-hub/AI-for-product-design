
import React, { useState } from 'react';
import { generateAIImage } from '../services/geminiService';
import { WorkflowStep } from '../types';
import { Layout, Wand2, Loader2, Download, Plus } from 'lucide-react';

const StoryboardGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [frames, setFrames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const generateStoryboard = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setFrames([]);
    
    try {
      const frameCount = 4;
      const newFrames: string[] = [];
      
      for (let i = 0; i < frameCount; i++) {
        setCurrentFrameIndex(i + 1);
        const sequencePrompts = [
          `场景 1: 产品亮相展示。${prompt}`,
          `场景 2: 用户与产品的功能交互。${prompt}`,
          `场景 3: 特写镜头，展示材质与设计细节。${prompt}`,
          `场景 4: 最终生活化使用场景展示。${prompt}`
        ];
        
        const result = await generateAIImage(`${sequencePrompts[i]}. 故事板风格, 保持产品与角色一致性, 电影概念艺术风格.`, "16:9");
        newFrames.push(result);
        setFrames([...newFrames]);
      }
    } catch (error) {
      console.error(error);
      alert("故事板生成中断。");
    } finally {
      setIsGenerating(false);
      setCurrentFrameIndex(0);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto h-full overflow-y-auto pb-20">
      <div className="p-8 bg-neutral-900 rounded-3xl border border-neutral-800 flex flex-col items-center gap-6">
        <div className="text-center space-y-2 max-w-2xl">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Layout className="w-8 h-8 text-indigo-400" />
            <h2 className="text-2xl font-bold">设计故事板</h2>
          </div>
          <p className="text-neutral-400 text-sm">
            生成包含 4 个画面的叙事序列，展示产品从拆箱到使用的完整心路历程。
          </p>
        </div>

        <div className="w-full max-w-3xl flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述产品及其使用场景（例如：'一款面向登山者的便携式太阳能充电器'）"
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <button
            onClick={generateStoryboard}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-8 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            {isGenerating ? `正在生成第 ${currentFrameIndex}/4 个画面...` : '生成序列'}
          </button>
        </div>
      </div>

      {frames.length > 0 || isGenerating ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative group">
              {frames[idx] ? (
                <>
                  <img src={frames[idx]} alt={`画面 ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 uppercase tracking-widest">
                    画面 0{idx + 1}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 opacity-30">
                  {isGenerating && currentFrameIndex === idx + 1 ? (
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                  ) : (
                    <Plus className="w-10 h-10" />
                  )}
                  <p className="text-xs uppercase tracking-widest font-bold">等待画面生成...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 border-2 border-dashed border-neutral-800 rounded-3xl flex flex-col items-center justify-center opacity-30 gap-3">
          <Layout className="w-12 h-12" />
          <p className="text-sm">您的故事板序列将在此处显示</p>
        </div>
      )}
    </div>
  );
};

export default StoryboardGenerator;
