import { Request, Response } from 'express';
import { searchCars } from './car-service';
import { parseUserInputWithGemini } from '../utils/geminiParser';
import SearchPrompt from '../search/models/Search'
import { sendEmail } from '../services/emailService';
import User from '../auth/models/User';



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
        const { user } = req as any;
        console.log("User:",user)

        const userInput = req.query.q as string;
        const searchParams = await parseUserInputWithGemini(userInput);
        const cars = await searchCars(searchParams);
        
        await SearchPrompt.findOneAndUpdate(
            { userId: user.id, prompt: userInput },
            {
                userId: user.id,
                prompt: userInput,
                lastSearchResult: cars,
                lastSearchTime: new Date()
            },
            { upsert: true, new: true }
        );

        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};


const checkNewCars = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Running manual car search check');

        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
        const searchPrompts = await SearchPrompt.find({
            lastSearchTime: { $lte: fourHoursAgo }
        });

        const results = [];

        for (const prompt of searchPrompts) {
            const searchParams = await parseUserInputWithGemini(prompt.prompt);
            const newCars = await searchCars(searchParams);

            const newCarIds = new Set(newCars.map(car => car.link.toString()));
            const oldCarIds = new Set(prompt.lastSearchResult.map(car => car.link.toString()));

            const newAvailableCars = newCars.filter(car => !oldCarIds.has(car.link.toString()));

            if (newAvailableCars.length > 0) {
                const user = await User.findById(prompt.userId);
                if (user) {
                    await sendEmail({
                        to: user.email,
                        subject: 'New Cars Available',
                        text: `We found ${newAvailableCars.length} new cars matching your search: "${prompt.prompt}"`,
                        html: `<p>We found ${newAvailableCars.length} new cars matching your search: "${prompt.prompt}"</p>`
                    });

                    results.push({
                        userId: user._id,
                        email: user.email,
                        prompt: prompt.prompt,
                        newCarsCount: newAvailableCars.length
                    });
                }
            }

            prompt.lastSearchResult = newCars;
            prompt.lastSearchTime = new Date();
            await prompt.save();
        }

        res.json({
            message: 'Car search check completed',
            searchesPerformed: searchPrompts.length,
            usersNotified: results.length,
            details: results
        });
    } catch (error) {
        console.error("Error in checkNewCars:", error);
        res.status(500).json({ error: 'An error occurred while checking for new cars' });
    }
};

export { getCars, getCarsByGemini, checkNewCars };
