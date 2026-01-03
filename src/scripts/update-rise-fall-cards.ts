import mongoose from 'mongoose';
import config from '../config/config';
import Card from '../models/card.model';

const updateRiseFall = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url);
    console.log('MongoDB connected');

    // Update all documents in cards collection: set rise=50, fall=50
    const result = await Card.updateMany(
      {}, 
      { $set: { rise: 50, fall: 50 } }
    );

    console.log(`Matched ${result.matchedCount} documents.`);
    console.log(`Modified ${result.modifiedCount} documents.`);
    console.log('Successfully updated rise and fall to 50 for all documents in cards collection.');

    process.exit(0);
  } catch (error) {
    console.error('Error updating fields:', error);
    process.exit(1);
  }
};

updateRiseFall();
