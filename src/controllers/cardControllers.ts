import { Request, Response } from "express";
import * as cardService from "./../services/cardService.js"

export async function createCards(req:Request, res: Response) {
    const apiKey = req.header["x-api-key"] as string;
    const { employeeId, type } = req.body;

    await cardService.create(apiKey, employeeId, type);
    res.send(201)


    
}



// cardRouter.post("/cards");
// cardRouter.patch("/cards/:id/activeCards");
// cardRouter.get("/cards/:id/cardsTransactions");
// cardRouter.post("/card/:id/lockCard");
// cardRouter.post("/card/:id/unlockCard");