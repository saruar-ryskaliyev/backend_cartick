import mongoose, { Schema, Document } from 'mongoose';

interface ICar extends Document {
    name: string;
    price: string;
    link: string;
    description: string;
    region: string;
    date: string;
    photos: string[];
}

const CarSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    link: { type: String, required: true },
    description: { type: String, required: true },
    region: { type: String, required: true },
    date: { type: String, required: true },
    photos: { type: [String], required: true }
});

const Car = mongoose.model<ICar>('Car', CarSchema);

export { ICar, Car };
