import jwt from "jsonwebtoken";

import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ", 2);

  if (bearer !== "Bearer") {
    throw HttpError(401, "Not authorized");
  }

  const { SECRET_KEY } = process.env;

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
