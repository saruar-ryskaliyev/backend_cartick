import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

interface SearchParams {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    region?: string;
    description?: string;
    generation?: string;
    bodyType?: string;
    engineVolume?: string;
    minMileage?: number;
    maxMileage?: number;
    transmission?: string;
    driveType?: string;
    steeringWheel?: string;
    color?: string;
    customsCleared?: string;
}

const parseUserInputWithGemini = async (input: string): Promise<SearchParams> => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `Analyze and parse the following Russian input into a structured format:
        Input: ${input}
        
        Steps:
        1. Identify car names, regions, price ranges, mileage ranges, and any descriptive terms.
        2. Translate only car names to English, keep all other fields in Russian.
        3. Parse the input into JSON format with these possible fields: name, minPrice, maxPrice, region, description, generation, bodyType, engineVolume, minMileage, maxMileage, transmission, driveType, steeringWheel, color, customsCleared.
        4. For price, convert to numbers in tenge (₸) if mentioned.
        5. For mileage, convert to numbers (without 'км').
        6. Keep region names in Russian in infinite form (Астане to Астана, Алмате to Алматы, Таразе to Тараз).
        7. For generation, include the year range and generation number if mentioned, in Russian.
        8. Keep bodyType in Russian (e.g., "седан").
        9. For engineVolume, keep the format "X.X (тип топлива)" in Russian.
        10. Keep transmission in Russian (e.g., "автомат").
        11. Keep driveType in Russian (e.g., "передний привод").
        12. Keep steeringWheel in Russian (e.g., "слева").
        13. Keep color in Russian.
        14. For customsCleared, use "Да" or "Нет".
        15. For the description field, convert all descriptive words to their infinite (dictionary) form in Russian. For example, "литые" should become "литой", "тонированные" should become "тонированный", etc.
        
        Example:
        If input is "Найди мне Митсубиси Галант в Атырау до 2 миллионов тенге, автомат, правый руль, растаможен, пробег до 350000 км, серебристый цвет, с литыми дисками и тонировкой", the output should be:
        {
          "name": "Mitsubishi Galant",
          "region": "Атырау",
          "maxPrice": 2000000,
          "maxMileage": 350000,
          "transmission": "автомат",
          "steeringWheel": "справа",
          "customsCleared": "Да",
          "color": "серебристый",
          "description": "литой диск тонировка"
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
        if (data.minPrice !== undefined) params.minPrice = Number(data.minPrice);
        if (data.maxPrice !== undefined) params.maxPrice = Number(data.maxPrice);
        if (data.region) params.region = data.region;
        if (data.description) params.description = data.description;
        if (data.generation) params.generation = data.generation;
        if (data.bodyType) params.bodyType = data.bodyType;
        if (data.engineVolume) params.engineVolume = data.engineVolume;
        if (data.minMileage !== undefined) params.minMileage = Number(data.minMileage);
        if (data.maxMileage !== undefined) params.maxMileage = Number(data.maxMileage);
        if (data.transmission) params.transmission = data.transmission;
        if (data.driveType) params.driveType = data.driveType;
        if (data.steeringWheel) params.steeringWheel = data.steeringWheel;
        if (data.color) params.color = data.color;
        if (data.customsCleared) params.customsCleared = data.customsCleared;

        return params;
    } catch (error) {
        console.error('Error parsing input with Gemini API:', error);
        throw new Error('Failed to parse input with Gemini API: ' + error);
    }
};

export { parseUserInputWithGemini, SearchParams };