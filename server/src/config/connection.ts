import mongoose from 'mongoose';

console.log(process.env.JWT_SECRET, process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/pet_social_network_db');

export default mongoose.connection;