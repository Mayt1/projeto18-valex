import { Router } from "express"
import { createCards } from "../controllers/cardControllers.js";
import { validateSchemaMiddleware } from "../middlewares/validadeSchemaMiddleware.js";
import { validateAPIKey } from "../middlewares/validateApiKeyMiddleware.js";
import createCardsSchema from "../schemas/createCardSchema.js";

const cardRouter = Router();

cardRouter.post("/cards", validateAPIKey, validateSchemaMiddleware(createCardsSchema), createCards);
cardRouter.patch("/cards/:id/activeCards");
cardRouter.get("/cards/:id/cardsTransactions");
cardRouter.post("/card/:id/lockCard");
cardRouter.post("/card/:id/unlockCard");


export default cardRouter;