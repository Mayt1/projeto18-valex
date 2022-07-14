import Joi from "joi";

const createCardsSchema = Joi.object({
    employeeId: Joi.number().required(),
    type: Joi.string().valid("restaurant", "education", "transport", "health", "groceries"). required()
});

export default createCardsSchema