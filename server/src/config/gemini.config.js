import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config({path:'../../.env'});
const API_KEY = "AIzaSyC6BMPNwgicdXeyJzI0E11M_q2EOFpxD6Y"

const genAI = new GoogleGenerativeAI(API_KEY);

export default genAI;