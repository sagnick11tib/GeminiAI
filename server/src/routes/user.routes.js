import { Router } from 'express';
import { getAllUsers, userSignup, userSignupAsGuest, userLogin, userLogout } from "../controllers/user.controllers.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = Router();

router.route('/').get(getAllUsers);
router.route('/signup').post(userSignup);
router.route('/login').post(userLogin);
router.route('/guest').post(userSignupAsGuest);
router.route('/logout').get(verifyJWT,userLogout);

export default router;




