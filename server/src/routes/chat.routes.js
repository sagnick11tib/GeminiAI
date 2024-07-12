import { Router } from 'express';

import {
  generateChatCompletion , sendChatsToUser, deleteChat
       } from "../controllers/chat-controllers.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

  const router = Router();
  router.route('/new').post(verifyJWT,generateChatCompletion);
  router.route('/all-chats').get(verifyJWT,sendChatsToUser);  
  router.route('/delete').delete(verifyJWT,deleteChat);

export default router;