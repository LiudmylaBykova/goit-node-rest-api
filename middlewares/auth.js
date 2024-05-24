import jwt from "jsonwebtoken";

import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    throw HttpError(401, "Not authorized");
  }
  const [bearer, token] = authorizationHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    throw HttpError(401, "Invalid token");
  }
  jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
    if (error) {
      throw HttpError(401, "Not authorized");
    }
    try {
      const user = await User.findById(decode.id);
      if (user === null) {
        throw HttpError(401, "Not authorized");
      }
      if (user.token !== token) {
        throw HttpError(401, "Not authorized");
      }
      req.user = {
        id: decode.id,
        email: user.email,
        subscription: user.subscription,
      };
      next();
    } catch (error) {
      next(error);
    }
  });
}

export default auth;
