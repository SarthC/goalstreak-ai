import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'f0ca9c531ed14b54900f1887e8ac70f6',
  baseURL: 'https://api.aimlapi.com/v1',
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from backend
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendMessage = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Using ChatGPT-4o as mentioned
      messages: [
        {
          role: 'system',
          content: 'You are an AI Study Assistant. Help students with personalized study plans, doubt resolution, topic explanations, practice questions, and study technique recommendations. Be helpful, encouraging, and educational.'
        },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
  } catch (error) {
    console.error('AI Service Error:', error);
    return 'Sorry, there was an error processing your request. Please try again.';
  }
};
