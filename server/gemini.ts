import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getChatbotResponse(message: string): Promise<string> {
  try {
    const systemPrompt = `You are a knowledgeable AYUSH (Ayurveda, Yoga & Naturopathy, Unani, Siddha) herbal medicine assistant. 
    
    Your expertise includes:
    - Traditional Indian medicinal plants and their properties
    - Ayurvedic principles and doshas
    - Preparation methods for herbal remedies
    - Traditional healing practices
    - Plant identification and usage
    - Safety considerations and contraindications
    
    Guidelines:
    - Provide accurate, helpful information about medicinal plants
    - Include preparation methods when relevant
    - Mention safety considerations
    - Reference traditional systems when appropriate
    - Be conversational but informative
    - If unsure, acknowledge limitations
    
    Keep responses concise but comprehensive.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "system", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: message }] }
      ],
    });

    return response.text || "I'm sorry, I couldn't process your request right now. Please try asking about specific medicinal plants or their uses.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm experiencing technical difficulties. Please try asking about specific plants like Turmeric, Neem, or Aloe Vera for their medicinal uses.";
  }
}