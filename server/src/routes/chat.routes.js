import { Router } from 'express';
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import {
    deleteChats,
    generateChatCompletion,
    sendChatsToUser,
       } from "../controllers/chat-controllers.js";

  const router = Router();
  router.route('/new').post(validate(chatCompletionValidator),verifyToken,generateChatCompletion);
  router.route('/all-chats').get(verifyToken,sendChatsToUser);
  router.route('/delete').delete(verifyToken,deleteChats);

export default router;