import { Car, ICar } from './models/car';

const searchCars = async (query: any): Promise<ICar[]> => {
    const { name, region, minPrice, maxPrice, description } = query;
    const searchQuery: any = {};

    if (name) searchQuery.name = new RegExp(name, 'i');
    if (region) searchQuery.region = region;
    if (minPrice || maxPrice) {
        searchQuery.price = {};
        if (minPrice) searchQuery.price.$gte = minPrice;
        if (maxPrice) searchQuery.price.$lte = maxPrice;
    }
    if (description) searchQuery.description = new RegExp(description, 'i');

    return await Car.find(searchQuery);
};

export { searchCars };
