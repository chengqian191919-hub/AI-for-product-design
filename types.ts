
export enum WorkflowStep {
  INSPIRATION = '灵感搜集',
  SKETCH = '草图生成',
  PRODUCT = '产品生图',
  RENDER = '渲染图生成',
  SCENE = '场景图生成',
  STORYBOARD = '故事板生成'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  type: WorkflowStep;
  timestamp: number;
}
