import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

interface SearchParams {
    name?: string;
    region?: string;
    minPrice?: number;
    maxPrice?: number;
    description?: string;
    minMileage?: number;
    maxMileage?: number;
}

const parseUserInputWithGemini = async (input: string): Promise<SearchParams> => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `Analyze and parse the following Russian input into a structured format:
        Input: ${input}
        
        Steps:
        1. Identify car names, regions, price ranges, mileage ranges, and any descriptive terms.
        2. Translate car names to English, but keep region names in Russian in infinite form (Астане to Астана, Алмате to Алматы, Таразе to Тараз).
        3. Parse the input into JSON format with these possible fields: name, region, minPrice, maxPrice, minMileage, maxMileage, description.
        4. For price, convert to numbers in tenge (₸) if mentioned.
        5. For mileage, convert to string as "15000 км" (km should be in cyrrilyc) if mentioned.
        
        Example:
        If input is "Найди мне Камри в Астане до 15 миллионов тенге с пробегом до 50000 км", the output should be:
        {
          "name": "Camry",
          "region": "Астана",
          "maxPrice": 15000000,
          "maxMileage": 50000,
          "description": ""
        }
        
        Output the result in JSON format.`;

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
        if (data.minPrice !== undefined) params.minPrice = Number(data.minPrice);
        if (data.maxPrice !== undefined) params.maxPrice = Number(data.maxPrice);
        if (data.minMileage !== undefined) params.minMileage = Number(data.minMileage);
        if (data.maxMileage !== undefined) params.maxMileage = Number(data.maxMileage);
        if (data.description) params.description = data.description;

        return params;
    } catch (error) {
        console.error('Error parsing input with Gemini API:', error);
        throw new Error('Failed to parse input with Gemini API: ' + error);
    }
};

export { parseUserInputWithGemini, SearchParams };