import { Car, ICar } from './models/car';
import { SearchParams } from '../utils/geminiParser';

const searchCars = async (query: SearchParams): Promise<ICar[]> => {
    const { name, region, minPrice, maxPrice, description, minMileage, maxMileage, generation } = query;
    const searchQuery: any = { $and: [] };

    if (name) searchQuery.$and.push({ name: new RegExp(`^${name}$`, 'i') }); // Strict name search
    if (region) searchQuery.$and.push({ region: new RegExp(region, 'i') });
    if (minPrice || maxPrice) {
        const priceQuery: any = {};
        if (minPrice) priceQuery.$gte = minPrice.toString() + ' ₸';
        if (maxPrice) priceQuery.$lte = maxPrice.toString() + ' ₸';
        searchQuery.$and.push({ price: priceQuery });
    }
    if (minMileage || maxMileage) {
        const mileageQuery: any = {};
        if (minMileage) mileageQuery.$gte = minMileage.toString() + ' км';
        if (maxMileage) mileageQuery.$lte = maxMileage.toString() + ' км';
        searchQuery.$and.push({ mileage: mileageQuery });
    }
    if (description) searchQuery.$and.push({ description: new RegExp(description, 'i') });

    // Handle generation matching
    if (generation) {
        const queryGenNumber = extractGenerationNumber(generation);
        if (queryGenNumber) {
            searchQuery.$and.push({
                $or: [
                    { generation: new RegExp(`\\b${queryGenNumber}\\s*(поколени[еяю]|generation)`, 'i') },
                    { generation: new RegExp(`\\bXV${queryGenNumber}\\b`, 'i') }
                ]
            });
        }
    }

    // If no criteria are provided, return all cars
    if (searchQuery.$and.length === 0) delete searchQuery.$and;

    return await Car.find(searchQuery);
};

// Helper function to extract generation number
function extractGenerationNumber(str: string): string | null {
    const match = str.match(/(\d+)\s*(поколени[еяю]|generation)/i);
    return match ? match[1] : null;
}

export { searchCars };