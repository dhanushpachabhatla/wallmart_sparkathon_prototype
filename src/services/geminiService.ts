import { GoogleGenerativeAI } from '@google/generative-ai';

// Note: In a real app, this would be stored securely in environment variables
const API_KEY = 'your-gemini-api-key-here'; // Replace with actual API key

const genAI = new GoogleGenerativeAI(API_KEY);

export interface GeminiResponse {
  text: string;
  products?: Array<{
    name: string;
    category: string;
    aisle?: string;
    price?: number;
  }>;
  recipe?: {
    name: string;
    ingredients: string[];
    instructions?: string[];
  };
}

export const generateResponse = async (prompt: string): Promise<GeminiResponse> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Enhanced prompt for better structured responses
    const enhancedPrompt = `
    You are WallyAI, a helpful shopping assistant for Walmart. 
    
    User query: "${prompt}"
    
    Please respond in a helpful, friendly manner. If the user is asking about:
    1. Recipe ingredients - list the items needed with estimated prices
    2. Product locations - mention aisle numbers when possible
    3. Shopping recommendations - suggest specific products
    
    Keep responses concise and actionable for in-store shopping.
    `;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse response for structured data (this is a simplified example)
    let products: any[] = [];
    let recipe: any = null;

    // Simple parsing logic - in a real app, you'd use more sophisticated NLP
    if (prompt.toLowerCase().includes('apple pie')) {
      products = [
        { name: 'Granny Smith Apples', category: 'Produce', aisle: '1', price: 3.48 },
        { name: 'All-Purpose Flour', category: 'Baking', aisle: '6', price: 2.98 },
        { name: 'Butter', category: 'Dairy', aisle: '12', price: 4.68 },
        { name: 'Sugar', category: 'Baking', aisle: '6', price: 2.48 },
        { name: 'Cinnamon', category: 'Spices', aisle: '6', price: 1.98 }
      ];
      recipe = {
        name: 'Apple Pie',
        ingredients: products.map(p => p.name),
        instructions: [
          'Preheat oven to 425°F',
          'Prepare pie crust',
          'Mix sliced apples with sugar and cinnamon',
          'Fill crust and bake for 45-50 minutes'
        ]
      };
    }

    return {
      text,
      products: products.length > 0 ? products : undefined,
      recipe
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback response
    return {
      text: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or I can help you with basic product information!"
    };
  }
};

export const isGeminiAvailable = (): boolean => {
  return API_KEY !== 'your-gemini-api-key-here' && API_KEY.length > 0;
};