import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config({path:'../../.env'});
const API_KEY = "PLACE YOUR API"

const genAI = new GoogleGenerativeAI(API_KEY);

export default genAI;
