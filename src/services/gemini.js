console.log("GEMINI:", import.meta.env.VITE_GEMINI_API_KEY);
import { GoogleGenerativeAI } from "@google/generative-ai";
console.log("GEMINI KEY:", import.meta.env.VITE_GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function generateStory(memoryText) {
  try {
    const prompt = `
You are Memoir AI.

Convert this grandparent memory into a warm children's story.

Memory:
${memoryText}

Requirements:
- 300 to 500 words
- Emotional and warm
- Suitable for ages 6-12
- Keep original details
- End with a positive lesson
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.error(error);
    return "Story generation failed.";
  }
}