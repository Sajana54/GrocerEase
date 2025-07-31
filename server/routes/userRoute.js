import express from "express";
import {
  isAuth,
  login,
  logout,
  registerTemp,
  verifyOtp,
  googleSignIn,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

// userRouter.post('/register', register)
userRouter.post("/register-temp", registerTemp);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/login", login);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", authUser, logout);
userRouter.post("/google-signin", googleSignIn);

export default userRouter;
