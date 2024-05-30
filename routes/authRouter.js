import express from "express";
const authRouter = express.Router();

import {
  register,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
} from "../controllers/authControllers.js";
import validateBody from "../middlewares/validateBody.js";
import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../schemas/authSchemas.js";
import authMiddleware from "../middlewares/auth.js";
import uploadMiddleware from "../middlewares/upload.js";

const jsonParser = express.json();

authRouter.post(
  "/register",
  jsonParser,
  validateBody(registerSchema),
  register
);
authRouter.post("/login", jsonParser, validateBody(loginSchema), login);
authRouter.get("/current", authMiddleware, current);
authRouter.post("/logout", authMiddleware, logout);
authRouter.patch(
  "/users",
  authMiddleware,
  jsonParser,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

authRouter.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  updateAvatar
);

export default authRouter;
