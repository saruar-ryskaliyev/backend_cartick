import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchPrompt extends Document {
  userId: mongoose.Types.ObjectId;
  prompt: string;
  lastSearchResult: any[];
  lastSearchTime: Date;
}

const SearchPromptSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: { type: String, required: true },
  lastSearchResult: { type: Array, default: [] },
  lastSearchTime: { type: Date, default: Date.now },
});

export default mongoose.model<ISearchPrompt>('SearchPrompt', SearchPromptSchema);