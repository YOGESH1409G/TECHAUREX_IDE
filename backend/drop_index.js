import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://Yogesh:Yogesh14@cluster0.6doahm3.mongodb.net/ROOM?retryWrites=true&w=majority';

async function dropPhoneIndex() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Drop the old phone_1 index
    try {
      await db.collection('users').dropIndex('phone_1');
      console.log('✅ Successfully dropped old phone_1 index');
    } catch (err) {
      if (err.code === 27 || err.codeName === 'IndexNotFound') {
        console.log('ℹ️  Index phone_1 does not exist (already dropped or never created)');
      } else {
        console.log('⚠️  Error dropping index:', err.message);
      }
    }
    
    console.log('\n✅ Done! Restart your server to create the sparse index.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  }
}

dropPhoneIndex();
