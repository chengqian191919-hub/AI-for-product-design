
import React, { useState } from 'react';
import { searchManufacturers } from '../services/geminiService';
import { Printer, Box, Factory, Loader2, Search, ExternalLink, Cpu, CheckCircle2 } from 'lucide-react';

const ProductionWorkspace: React.FC = () => {
  const [productType, setProductType] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSlicing, setIsSlicing] = useState(false);
  const [sliceProgress, setSliceProgress] = useState(0);
  const [searchResult, setSearchResult] = useState<{text: string, sources: any[]} | null>(null);

  const handleStartSlice = () => {
    setIsSlicing(true);
    setSliceProgress(0);
    const interval = setInterval(() => {
      setSliceProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsSlicing(false), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleSearch = async () => {
    if (!productType.trim()) return;
    setIsSearching(true);
    try {
      const result = await searchManufacturers(productType);
      setSearchResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 3D打印与切片模拟 */}
        <div className="p-8 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Printer className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">3D 打印与打样</h3>
              <p className="text-sm text-neutral-400">将概念转化为实体模型</p>
            </div>
          </div>

          <div className="bg-neutral-800/50 rounded-2xl border border-neutral-700 p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">切片引擎状态</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-4 h-4" /> Ready
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
                <span>切片进度 (G-Code)</span>
                <span>{sliceProgress}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${sliceProgress}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={handleStartSlice}
              disabled={isSlicing}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {isSlicing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Cpu className="w-5 h-5" />}
              {isSlicing ? '正在生成切片路径...' : '开始切片并发送至打印机'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-800/30 border border-neutral-700 rounded-xl">
              <p className="text-[10px] text-neutral-500 uppercase font-bold">推荐材料</p>
              <p className="text-sm font-medium mt-1">PLA / ABS / 树脂</p>
            </div>
            <div className="p-4 bg-neutral-800/30 border border-neutral-700 rounded-xl">
              <p className="text-[10px] text-neutral-500 uppercase font-bold">预计时长</p>
              <p className="text-sm font-medium mt-1">4h 25m</p>
            </div>
          </div>
        </div>

        {/* 生产与供应链 */}
        <div className="p-8 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Factory className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">量产与供应链</h3>
              <p className="text-sm text-neutral-400">对接代工厂与寻找供应商</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                placeholder="输入产品类别（如：智能运动手表）"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl transition-all"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>
            </div>

            <div className="h-48 overflow-y-auto bg-neutral-800/50 border border-neutral-700 rounded-2xl p-4 text-sm text-neutral-300 custom-scrollbar">
              {searchResult ? (
                <div className="space-y-4">
                  <div className="prose prose-invert prose-sm">
                    {searchResult.text}
                  </div>
                  {searchResult.sources.length > 0 && (
                    <div className="pt-4 border-t border-neutral-700">
                      <p className="text-xs font-bold text-neutral-500 uppercase mb-2">参考链接:</p>
                      {searchResult.sources.map((src: any, i: number) => (
                        <a key={i} href={src.web?.uri} target="_blank" className="flex items-center gap-2 text-blue-400 hover:underline mb-1">
                          <ExternalLink className="w-3 h-3" /> {src.web?.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40 text-center">
                  <Factory className="w-10 h-10 mb-2" />
                  <p>输入产品类别并点击搜索<br/>获取生产厂商建议</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionWorkspace;
