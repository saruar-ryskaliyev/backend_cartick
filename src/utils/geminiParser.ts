import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

interface SearchParams {
    name?: string;
    region?: string;
    minPrice?: number;
    maxPrice?: number;
    description?: string;
}

const parseUserInputWithGemini = async (input: string): Promise<SearchParams> => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `Parse the following input into a structured format:
        Input: ${input}
        Output should be in JSON format with these possible fields: name, region, minPrice, maxPrice, description`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        console.log('Raw Gemini API response:', text);

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in the response');
        }
        text = jsonMatch[0];

        console.log('Extracted JSON:', text);

        // Parse the JSON response
        const data = JSON.parse(text);

        const params: SearchParams = {};
        if (data.name) params.name = data.name;
        if (data.region) params.region = data.region;
        if (data.minPrice !== null) params.minPrice = Number(data.minPrice);
        if (data.maxPrice !== null) params.maxPrice = Number(data.maxPrice);
        if (data.description) params.description = data.description;

        return params;
    } catch (error) {
        console.error('Error parsing input with Gemini API:', error);
        throw new Error('Failed to parse input with Gemini API: ' + error);
    }
};

export { parseUserInputWithGemini, SearchParams };