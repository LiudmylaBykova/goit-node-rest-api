import Joi from "joi";

const telRegexp = /^\([0-9]{3}\) [0-9]{3}\-[0-9]{4}$/;

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(telRegexp).required().messages({
    "string.pattern.base": "Must be a correct number: (099) 999-9999",
  }),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.string().pattern(telRegexp).messages({
    "string.pattern.base": "Must be a correct number: (099) 999-9999",
  }),
  favorite: Joi.boolean(),
});

export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
