import dotenv from 'dotenv';
import connectDB from './config/connectionDB.js';
import { app } from './app.js';

// Ensure dotenv.config() is called before any other module that needs environment variables
dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 9000;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED:", err);
  });