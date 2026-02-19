const mongoose = require('mongoose');
require('dotenv').config();

async function initDB() {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
  const dbName = process.env.DB_NAME || 'booky';

  await mongoose.connect(mongoUrl, {
    dbName,
  });

  // Simple log so you know connection worked
  // (Atlas will automatically create the DB and collection when first document is saved)
  console.log(`Connected to MongoDB database "${dbName}".`);
}

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = { initDB, User };
