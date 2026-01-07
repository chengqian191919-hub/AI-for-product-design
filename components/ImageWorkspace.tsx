
import React, { useState } from 'react';
import { generateAIImage, editAIImage } from '../services/geminiService';
import { WorkflowStep } from '../types';
import { Wand2, Download, RotateCcw, ImageIcon, Maximize2, Loader2, Sparkles, Layers, Box, Layout } from 'lucide-react';

interface ImageWorkspaceProps {
  step: WorkflowStep;
  title: string;
  description: string;
  placeholderPrompt: string;
}

const ImageWorkspace: React.FC<ImageWorkspaceProps> = ({ step, title, description, placeholderPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const fullPrompt = `${step} 需求: ${prompt}. Cinematic lighting, 8k resolution, photorealistic, professional industrial design aesthetic.`;
      const result = await generateAIImage(fullPrompt, aspectRatio);
      setImage(result);
    } catch (error) {
      console.error(error);
      alert("图片生成失败，请重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!image || isLoading) return;
    setIsLoading(true);
    try {
      const refinePrompt = `进一步优化这张 ${step}，增强细节、材质和纹理，基于以下需求: ${prompt || '保持初衷'}。提升整体的高级感和专业度。`;
      const result = await editAIImage(image, refinePrompt);
      setImage(result);
    } catch (error) {
      console.error(error);
      alert("优化失败。");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `designflow-${step}.png`;
    link.click();
  };

  const getStepIcon = () => {
    switch (step) {
      case WorkflowStep.SKETCH: return <Layers className="w-6 h-6 text-orange-400" />;
      case WorkflowStep.PRODUCT: return <Box className="w-6 h-6 text-blue-400" />;
      case WorkflowStep.RENDER: return <Sparkles className="w-6 h-6 text-purple-400" />;
      case WorkflowStep.SCENE: return <ImageIcon className="w-6 h-6 text-green-400" />;
      default: return <Wand2 className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full max-w-6xl mx-auto">
      {/* 控制面板 */}
      <div className="space-y-6">
        <div className="p-6 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neutral-800 rounded-xl">
              {getStepIcon()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm text-neutral-400">{description}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">提示词指令</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholderPrompt}
                className="w-full h-32 bg-neutral-800 border border-neutral-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">画面比例</label>
              <div className="flex gap-3">
                {(["1:1", "16:9", "9:16"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      aspectRatio === ratio
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                {image ? '重新生成' : '生成概念图'}
              </button>
              {image && (
                <button
                  onClick={handleRefine}
                  disabled={isLoading}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 disabled:opacity-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  精细化调整
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 提示卡片 */}
        <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex gap-4 items-start">
          <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
          <p className="text-xs text-emerald-400 leading-relaxed">
            <strong>专家建议：</strong> 请具体描述材质（如“磨砂铝合金”、“环保亚光塑料”）和光影效果（如“演播室轮廓光”、“柔和的晨曦”），以获得最佳生成效果。
          </p>
        </div>
      </div>

      {/* 预览面板 */}
      <div className="relative group">
        <div className="aspect-square w-full bg-neutral-900 rounded-3xl border border-neutral-800 flex items-center justify-center overflow-hidden relative shadow-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                <Wand2 className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
              </div>
              <p className="text-sm font-medium animate-pulse text-blue-400">正在雕琢您的设计...</p>
            </div>
          ) : image ? (
            <div className="relative w-full h-full">
              <img src={image} alt="生成的设计" className="w-full h-full object-contain" />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={downloadImage}
                  className="p-2 bg-black/60 backdrop-blur-md rounded-lg hover:bg-black/80 transition-colors"
                  title="下载图片"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  className="p-2 bg-black/60 backdrop-blur-md rounded-lg hover:bg-black/80 transition-colors"
                  title="全屏查看"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3 opacity-30">
              <ImageIcon className="w-20 h-20 mx-auto" />
              <p className="text-sm">设计预览将在此处显示</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageWorkspace;
