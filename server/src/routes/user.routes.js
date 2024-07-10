import { Router } from 'express';
import {
    getAllUsers,
    userLogin,
    userLogout,
    userSignup,
    userSignupAsGuest,
    verifyUser,
  } from "../controllers/user-controller.js";
import {
    loginValidator,
    signupValidator,
    validate,
  } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const router = Router();

router.route('/').get(getAllUsers);
router.route('/signup').post(validate(signupValidator),userSignup);
router.route('/login').post(validate(loginValidator),userLogin);
router.route('/guest').post(userSignupAsGuest);
router.route('/auth-status').get(verifyToken,verifyUser);
router.route('/logout').get(verifyToken,userLogout);

export default router;




