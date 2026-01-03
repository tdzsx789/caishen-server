import mongoose from 'mongoose';
import config from '../config/config';
import MultipleCard from '../models/multipleCard.model';

const removeRiseFall = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url);
    console.log('MongoDB connected');

    // Update all documents in multiple_cards collection to remove rise and fall fields
    const result = await MultipleCard.updateMany(
      {}, 
      { $unset: { rise: 1, fall: 1 } }
    );

    console.log(`Matched ${result.matchedCount} documents.`);
    console.log(`Modified ${result.modifiedCount} documents.`);
    console.log('Successfully removed rise and fall fields from multiple_cards collection.');

    process.exit(0);
  } catch (error) {
    console.error('Error removing fields:', error);
    process.exit(1);
  }
};

removeRiseFall();
