import { Request, Response } from "express";
import * as cardService from "./../services/cardService.js"

export async function createCards(req:Request, res: Response) {
    const apiKey = req.header["x-api-key"] as string;
    const { employeeId, type } = req.body;

    await cardService.create(apiKey, employeeId, type);
    res.send(201)

}

export async function activeCards(req: Request, res: Response) {
    const {id: cardId} = req.params;
    const { cvc, password } = req.body

    await cardService.activate(Number(cardId), cvc, password);
    res.sendStatus(200);
}

export async function transactions(req: Request, res: Response) {
    const { id: cardId } = req.params;
    const transactions = await cardService.transactions(Number(cardId));

    res.send(transactions);
}