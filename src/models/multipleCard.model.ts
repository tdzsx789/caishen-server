import mongoose, { Model } from 'mongoose';
import { ICard, cardSchema } from './card.model';

const multipleCardSchema = cardSchema.clone();
multipleCardSchema.remove('rise');
multipleCardSchema.remove('fall');
multipleCardSchema.set('collection', 'multiple_cards');

const MultipleCard: Model<ICard> = mongoose.model<ICard>('MultipleCard', multipleCardSchema);

export default MultipleCard;
