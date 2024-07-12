import mongoose from 'mongoose';
import { config } from 'dotenv';
config({path:'../../.env'});
const connectDB = async ()=>{
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL+'/'+"geminiDB");
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED ", error);
    process.exit(1);
  }  
}

export default connectDB // default means we can import this function with any name in other files
//no default means we have to import this function with the same name in other files