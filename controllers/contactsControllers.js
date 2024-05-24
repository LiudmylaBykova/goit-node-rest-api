import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;
    let query = { owner };
    if (favorite !== undefined) {
      query.favorite = favorite;
    }
    const contacts = await Contact.find(query, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "email subscription");
    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const contact = await Contact.findOne({ _id: id, owner });
    if (contact === null) {
      throw HttpError(404, "Not found");
    }
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const deletedContact = await Contact.findOneAndDelete({ _id: id, owner });
    if (deletedContact === null) {
      throw HttpError(404, "Not found");
    }
    return res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const newContact = await Contact.create({ ...req.body, owner });
    return res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner },
      req.body,
      { new: true }
    );

    if (updatedContact === null) {
      throw HttpError(404, "Not found");
    }
    return res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const updatedStatusContact = await Contact.findOneAndUpdate(
      { _id: id, owner },
      req.body,
      { new: true }
    );
    if (updatedStatusContact === null) {
      throw HttpError(404, "Not found");
    }
    return res.status(200).json(updatedStatusContact);
  } catch (error) {
    next(error);
  }
};
