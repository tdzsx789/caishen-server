import mongoose from 'mongoose';
import config from '../config/config';
import Card, { cardSchema, ICard } from '../models/card.model';

const migrate = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url);
    console.log('MongoDB connected');

    // Define MultipleCard model using the same schema but different collection
    // We clone the schema to avoid modifying the original one attached to Card
    const multipleCardSchema = cardSchema.clone();
    // Ensure collection name is set correctly
    multipleCardSchema.set('collection', 'multiple_cards');
    
    const MultipleCard = mongoose.model<ICard>('MultipleCard', multipleCardSchema);

    // Find all cards with subType: 'multiple'
    const multipleCards = await Card.find({ subType: 'multiple' });
    console.log(`Found ${multipleCards.length} cards with subType: 'multiple'`);

    if (multipleCards.length === 0) {
      console.log('No cards to migrate.');
      process.exit(0);
    }

    // Insert into multiple_cards
    // We use toObject() to get plain objects, but we need to handle _id
    // insertMany works well with array of objects
    const docsToInsert = multipleCards.map(card => card.toObject());
    
    const result = await MultipleCard.insertMany(docsToInsert);
    console.log(`Inserted ${result.length} documents into multiple_cards`);

    // Delete from cards
    const deleteResult = await Card.deleteMany({ subType: 'multiple' });
    console.log(`Deleted ${deleteResult.deletedCount} documents from cards`);

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
