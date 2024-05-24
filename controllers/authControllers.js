import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";

const { SECRET_KEY } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user !== null) {
      throw HttpError(409, "Email in use");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: passwordHash });
    return res
      .status(201)
      .json({ email: newUser.email, subscription: newUser.subscription });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      throw HttpError(401, "Email or password is wrong");
    }
    const payload = {
      id: user._id,
      email: user.email,
      subscription: user.subscription,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token }, { new: true });
    return res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { subscription } = req.body;
    const updated = await User.findByIdAndUpdate(
      id,
      { subscription },
      { new: true }
    );
    return res
      .status(200)
      .json({ email: updated.email, subscription: updated.subscription });
  } catch (error) {
    next(error);
  }
};
