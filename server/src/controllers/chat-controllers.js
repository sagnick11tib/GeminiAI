import genAI from "../config/gemini.config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js";
import { SYSTEM_INSTRUCTIONS } from "../utils/constants.js";

const generateChatCompletion = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    throw new ApiError(400, "Prompt is required");
  }
  try {
    const user = await User.findById(req.user._id).populate('chats');
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.credits <= 0) {
      throw new ApiError(402, "Insufficient credits");
    }
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstructions: SYSTEM_INSTRUCTIONS,
      
    });

    const chat = model.startChat({
      history: user.chats.map((chat) => ({
        role: chat.role,
        parts: chat.parts.map((part) => ({ text: part.text })),
      })),
      generationConfig: { maxOutputTokens: 500 },
    });

    const userChat = await Chat.create({ role: "user", parts: [{ text: message }] });
    user.chats.push(userChat._id);

    const result = await chat.sendMessage(message);
   
    const text =result.response.text() ; 
    

    const modelChat = await Chat.create({ role: "model", parts: [{ text }] });
    user.chats.push(modelChat._id);
    user.credits -= 1;  

    await user.save();

    return res.status(200).json(new ApiResponse(200, { text }, "Chat completion generated successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(new ApiResponse(500, {}, error.message));
  }
});

const sendChatsToUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('chats');
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden");
  }
  return res.status(200).json(new ApiResponse(200, { chats: user.chats, credits: user.credits }, "Chats sent successfully"));
});

const deleteChat = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden");
  }
  await Chat.deleteMany({ _id: { $in: user.chats } });
  user.chats = [];
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Chats deleted successfully"));
});

export { generateChatCompletion, sendChatsToUser, deleteChat};
