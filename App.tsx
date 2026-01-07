
import React, { useState } from 'react';
import { WorkflowStep } from './types';
import InspirationChat from './components/InspirationChat';
import ImageWorkspace from './components/ImageWorkspace';
import StoryboardGenerator from './components/StoryboardGenerator';
import ProductionWorkspace from './components/ProductionWorkspace';
import { 
  Sparkles, 
  PenTool, 
  Box, 
  SunMedium, 
  Camera, 
  Layout, 
  ChevronRight,
  Menu,
  X,
  BoxSelect,
  Ruler,
  Factory
} from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(WorkflowStep.INSPIRATION);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const steps = [
    { id: WorkflowStep.INSPIRATION, icon: <Sparkles className="w-5 h-5" />, label: "灵感搜集", desc: "AI 创意激发" },
    { id: WorkflowStep.SKETCH, icon: <PenTool className="w-5 h-5" />, label: "草图生成", desc: "概念草拟" },
    { id: WorkflowStep.PRODUCT, icon: <Box className="w-5 h-5" />, label: "产品生图", desc: "造型与风格" },
    { id: WorkflowStep.MODELING, icon: <BoxSelect className="w-5 h-5" />, label: "产品建模", desc: "三维构思" },
    { id: WorkflowStep.RENDER, icon: <SunMedium className="w-5 h-5" />, label: "渲染图生成", desc: "材质与细节" },
    { id: WorkflowStep.ENGINEERING, icon: <Ruler className="w-5 h-5" />, label: "工程制图", desc: "标准制图" },
    { id: WorkflowStep.SCENE, icon: <Camera className="w-5 h-5" />, label: "场景图生成", desc: "环境模拟" },
    { id: WorkflowStep.STORYBOARD, icon: <Layout className="w-5 h-5" />, label: "故事板生成", desc: "使用方式" },
    { id: WorkflowStep.PRODUCTION, icon: <Factory className="w-5 h-5" />, label: "打样与生产", desc: "供应链对接" },
  ];

  const renderContent = () => {
    switch (currentStep) {
      case WorkflowStep.INSPIRATION:
        return <InspirationChat />;
      case WorkflowStep.SKETCH:
        return (
          <ImageWorkspace 
            step={currentStep} 
            title="AI 概念草图" 
            description="将抽象想法转化为最初的视觉初稿与造型探索。"
            placeholderPrompt="例如：极简主义未来派人机工程学台灯草图，线稿风格，炭笔质感"
          />
        );
      case WorkflowStep.PRODUCT:
        return (
          <ImageWorkspace 
            step={currentStep} 
            title="AI 产品生图" 
            description="生成具有高度写实感和精细纹理的产品概念图。"
            placeholderPrompt="例如：高端手持浓缩咖啡机，哑光黑铝合金材质，木质装饰点缀"
          />
        );
      case WorkflowStep.MODELING:
        return (
          <ImageWorkspace 
            step={currentStep} 
            title="AI 三维建模概念" 
            description="生成产品的多角度视图、正交视图及拓扑概念，为CAD建模做准备。"
            placeholderPrompt="例如：智能音箱的三个视图（正、侧、俯），展示曲面流向和接口布局"
          />
        );
      case WorkflowStep.RENDER:
        return (
          <ImageWorkspace 
            step={currentStep} 
            title="AI 渲染表现" 
            description="为您的设计应用专业级光影效果与材质精修。"
            placeholderPrompt="例如：产品材质微距特写，柔和的演播室灯光，虚化背景"
          />
        );
      case WorkflowStep.ENGINEERING:
        return (
          <div className="bg-blue-900/5 rounded-3xl p-1 border border-blue-500/10">
            <ImageWorkspace 
              step={currentStep} 
              title="AI 工程制图" 
              description="生成符合标准的工程图纸、带标注的蓝图或技术说明图。"
              placeholderPrompt="例如：产品的工程蓝图样式，包含尺寸标注线，白色线条蓝色背景，侧视图"
            />
          </div>
        );
      case WorkflowStep.SCENE:
        return (
          <ImageWorkspace 
            step={currentStep} 
            title="AI 场景模拟" 
            description="将产品置于真实的场景中，可视化比例与环境契合度。"
            placeholderPrompt="例如：产品放置在阳光明媚的现代公寓中，极简主义橡木茶几之上"
          />
        );
      case WorkflowStep.STORYBOARD:
        return <StoryboardGenerator />;
      case WorkflowStep.PRODUCTION:
        return <ProductionWorkspace />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-neutral-200 overflow-hidden">
      {/* 侧边栏 */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } border-r border-neutral-800 bg-[#0d0d0d] flex flex-col transition-all duration-300 ease-in-out relative z-30`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-white">DesignFlow AI</span>}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative ${
                currentStep === step.id 
                  ? 'bg-neutral-800 text-white border border-neutral-700 shadow-inner shadow-black/20' 
                  : 'text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-300'
              }`}
            >
              <div className={`shrink-0 transition-colors ${currentStep === step.id ? 'text-blue-500' : 'group-hover:text-neutral-300'}`}>
                {step.icon}
              </div>
              {isSidebarOpen && (
                <div className="text-left">
                  <div className="text-xs font-semibold">{step.label}</div>
                  <div className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider">{step.desc}</div>
                </div>
              )}
              {!isSidebarOpen && (
                 <div className="absolute left-full ml-4 px-2 py-1 bg-neutral-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-neutral-700 z-50">
                    {step.label}
                 </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
           <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-neutral-800 text-neutral-500 transition-all"
           >
             {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a]">
        <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-8 bg-[#0d0d0d]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
            <span>设计流程</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-bold">{currentStep}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              AI 驱动设计全流程工作室
            </div>
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center cursor-pointer hover:bg-neutral-700 transition-colors">
              <span className="text-xs font-bold text-neutral-400">CQ</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
