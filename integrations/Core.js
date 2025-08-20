import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const InvokeLLM = async ({ prompt, priceRange }) => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create the generation config
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON response
    try {
      const jsonResponse = JSON.parse(text);
      return jsonResponse;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.log('Raw response:', text);
      throw new Error("Failed to parse AI response. Please try again.");
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error("Failed to get recommendations. Please try again.");
  }
};
