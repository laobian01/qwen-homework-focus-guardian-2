
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, FocusStatus } from "../types";

export const analyzeFrame = async (base64Image: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check settings.");
  }

  // 基础校验
  if (!base64Image || base64Image === "data:," || base64Image.length < 100) {
    throw new Error("Invalid frame captured (empty data)");
  }

  const ai = new GoogleGenAI({ apiKey });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      status: {
        type: Type.STRING,
        enum: [FocusStatus.FOCUSED, FocusStatus.DISTRACTED, FocusStatus.ABSENT, FocusStatus.BAD_POSTURE]
      },
      message: {
        type: Type.STRING,
      },
      confidence: {
        type: Type.NUMBER,
      }
    },
    required: ["status", "message", "confidence"]
  };

  try {
    // Helper to clean base64
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
    // Default mimeType if not present in string (though captureFrame adds it)
    const mimeType = base64Image.match(/^data:(image\/\w+);base64,/) ? 
                     base64Image.match(/^data:(image\/\w+);base64,/)[1] : "image/jpeg";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: `你是一个严格但友善的作业监督助手。请分析这张图片中的学生状态。
            
            判断规则：
            - FOCUSED (专注): 眼睛看书/本子，正在写字，阅读，坐姿端正。如果是正在拿文具、翻书、找橡皮等与学习相关的短动作，也算作 FOCUSED。
            - BAD_POSTURE (坐姿不端): 眼睛距离书本/屏幕过近(<30cm)，趴在桌子上写字，歪着头写字，或者驼背严重。此状态优先级高于 FOCUSED。
            - DISTRACTED (分心): 明显的东张西望，玩玩具，睡觉，看手机，发呆。
            - ABSENT (离开): 椅子上没人。
            
            message 规则 (中文语音提示文本, 10字以内):
            - 专注时: 给予鼓励 (如"坐姿很端正，继续加油")
            - 坐姿不端时: 提醒健康 (如"请坐直身体，保护眼睛")
            - 分心时: 温柔提醒 (如"快快回神，专心写作业")
            - 离开时: 询问去向 (如"人去哪里了呀")
            `
          },
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text) as AnalysisResult;
    
    // Safety check on status
    if (![FocusStatus.FOCUSED, FocusStatus.DISTRACTED, FocusStatus.ABSENT, FocusStatus.BAD_POSTURE].includes(result.status)) {
        result.status = FocusStatus.DISTRACTED;
    }

    return result;

  } catch (error: any) {
    console.error("Analysis failed:", error);
    
    if (error.message === "Invalid frame captured (empty data)") {
        throw error;
    }

    return {
      status: FocusStatus.ERROR,
      message: error.message || "连接错误",
      confidence: 0
    };
  }
};
