import { Car, ICar } from './models/car';
import { SearchParams } from '../utils/geminiParser';

const searchCars = async (query: SearchParams): Promise<ICar[]> => {
    const { name, region, minPrice, maxPrice, description, minMileage, maxMileage } = query;
    const searchQuery: any = {};

    if (name) searchQuery.name = new RegExp(name, 'i');
    if (region) searchQuery.region = new RegExp(region, 'i');
    if (minPrice || maxPrice) {
        searchQuery.price = {};
        if (minPrice) searchQuery.price.$gte = minPrice.toString() + ' ₸';
        if (maxPrice) searchQuery.price.$lte = maxPrice.toString() + ' ₸';
    }
    if (minMileage || maxMileage) {
        searchQuery.mileage = {};
        if (minMileage) searchQuery.mileage.$gte = minMileage.toString() + ' км';
        if (maxMileage) searchQuery.mileage.$lte = maxMileage.toString() + ' км';
    }
    if (description) searchQuery.description = new RegExp(description, 'i');

    return await Car.find(searchQuery);
};

export { searchCars };