
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateDesignInspiration = async (prompt: string, history: { role: string, parts: { text: string }[] }[]) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "你是一位世界级的工业设计师和产品策略专家。请协助用户进行创新的产品构思、材料选择、人机工程学建议和审美方向探讨。你的回答应专业、简洁且富有启发性。请始终使用中文回答，并使用 markdown 格式以便于阅读。",
    },
  });

  const response = await chat.sendMessage({ message: prompt });
  return response.text;
};

export const generateAIImage = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4" = "1:1") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio,
      }
    }
  });

  const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (imagePart?.inlineData) {
    return `data:image/png;base64,${imagePart.inlineData.data}`;
  }
  throw new Error("图片生成失败");
};

export const editAIImage = async (baseImage64: string, prompt: string) => {
  const ai = getAI();
  const pureBase64 = baseImage64.split(',')[1];
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: pureBase64,
            mimeType: 'image/png'
          }
        },
        { text: prompt }
      ]
    }
  });

  const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (imagePart?.inlineData) {
    return `data:image/png;base64,${imagePart.inlineData.data}`;
  }
  throw new Error("图片优化失败");
};

export const searchManufacturers = async (productType: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `请帮我搜索并列举出适合生产 ${productType} 的优质代工厂、3D打印服务商和模具厂。请提供建议的合作流程。`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
