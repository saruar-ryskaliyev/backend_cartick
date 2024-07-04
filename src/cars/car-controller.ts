import { Request, Response } from 'express';
import { searchCars } from './car-service';
import { parseUserInputWithGemini } from '../utils/geminiParser';


const getCars = async (req: Request, res: Response): Promise<void> => {
    try {
        const cars = await searchCars(req.query);
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const getCarsByGemini = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Headers:", req.headers);
        console.log("Auth header:", req.headers.authorization);
        const { user } = req as any;
        console.log("User:",user)

        const userInput = req.query.q as string;
        const searchParams = await parseUserInputWithGemini(userInput);
        const cars = await searchCars(searchParams);
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export { getCars, getCarsByGemini };
