import Joi from "joi";

const emailRegexp = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

export const registerSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({ "string.pattern.base": "Must be a valid email" }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({ "string.min": "Must be min 8 characters" }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({ "string.pattern.base": "Must be a valid email" }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({ "string.min": "Must be min 8 characters" }),
});

export const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});
