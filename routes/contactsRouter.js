import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import validateBody from "../middlewares/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactSchemas.js";

import { isEmptyBoby } from "../middlewares/isEmptyBody.js";

import isValidId from "../middlewares/isValidId.js";
import authMiddleware from "../middlewares/auth.js";

const jsonParser = express.json();

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware, getAllContacts);

contactsRouter.get("/:id", authMiddleware, isValidId, getOneContact);

contactsRouter.delete("/:id", authMiddleware, isValidId, deleteContact);

contactsRouter.post(
  "/",
  authMiddleware,
  jsonParser,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  authMiddleware,
  jsonParser,
  isValidId,
  isEmptyBoby,
  validateBody(updateContactSchema),
  updateContact
);
contactsRouter.patch(
  "/:id/favorite",
  authMiddleware,
  jsonParser,
  isValidId,
  validateBody(updateStatusSchema),
  updateStatusContact
);

export default contactsRouter;
