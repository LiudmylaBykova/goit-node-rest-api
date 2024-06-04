import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import jimpAvatar from "../helpers/jimpAvatar.js";
import mail from "../helpers/mail.js";

const { SECRET_KEY } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user !== null) {
      throw HttpError(409, "Email in use");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);

    const verificationToken = crypto.randomUUID();

    mail.sendMail({
      to: email,
      from: "test@gmail.com",
      subject: "Verify email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click on this link to verify email</a>`,
    });

    const newUser = await User.create({
      email,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });

    return res
      .status(201)
      .json({ email: newUser.email, subscription: newUser.subscription });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (user === null) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    return res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user === null) {
      throw HttpError(401, "Email not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    mail.sendMail({
      to: email,
      from: "test@gmail.com",
      subject: "Verify email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click on this link to verify email</a>`,
    });

    return res.status(200).json({
      message: "Verification email sent",
    });
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

    if (user.verify === false) {
      throw HttpError(401, "Please, verify your email");
    }

    const payload = {
      id: user._id,
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

    if (updated === null) {
      throw HttpError(404, "Not found");
    }

    return res
      .status(200)
      .json({ email: updated.email, subscription: updated.subscription });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "Avatar is required");
    }

    const { id } = req.user;
    const { filename } = req.file;

    const newPath = path.resolve("public", "avatars", req.file.filename);
    await jimpAvatar(req.file.path);
    await fs.rename(req.file.path, newPath);
    const avatarURL = path.join("avatars", filename);

    const updated = await User.findByIdAndUpdate(
      id,
      { avatarURL },
      { new: true }
    );

    if (updated === null) {
      throw HttpError(404, "Not found");
    }

    return res.status(200).json({ avatarUrl: updated.avatarURL });
  } catch (error) {
    next(error);
  }
};
