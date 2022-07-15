import Joi from "joi";

const activateSchema = Joi.object({
    cvc: Joi.string().required(),
    password: Joi.string().required(),
});

export default activateSchema