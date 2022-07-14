import { NextFunction, Response, Request } from "express";
import { ObjectSchema } from "joi"

export function validateSchemaMiddleware(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validate = schema.validate(req.body);
        if(validate.error) {
            return res.status(422).send(validate.error);
        }

        next();
    }

}