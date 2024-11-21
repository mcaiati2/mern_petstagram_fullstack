import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/pet_social_network_db');

export default mongoose.connection;