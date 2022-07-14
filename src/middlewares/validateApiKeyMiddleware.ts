import { NextFunction, Response, Request } from "express";

export function validateAPIKey(req: Request, res: Response, next: NextFunction){
    const APIkey = req.header["x-api-key"].toString();
    if(!APIkey) {
        throw { type: "unauthorized", message: "invalid api key"};
    }

    next();
}