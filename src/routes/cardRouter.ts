import { Router } from "express"
import { activeCards, createCards, transactions } from "../controllers/cardControllers.js";
import { validateSchemaMiddleware } from "../middlewares/validadeSchemaMiddleware.js";
import { validateAPIKey } from "../middlewares/validateApiKeyMiddleware.js";
import activateSchema from "../schemas/activateSchema.js";
import createCardsSchema from "../schemas/createCardSchema.js";

const cardRouter = Router();

cardRouter.post("/cards", validateAPIKey, validateSchemaMiddleware(createCardsSchema), createCards);
cardRouter.patch("/cards/:id/activeCards", validateSchemaMiddleware(activateSchema), activeCards);
cardRouter.get("/cards/:id/cardsTransactions", transactions);


cardRouter.post("/card/:id/lockCard");
cardRouter.post("/card/:id/unlockCard");

cardRouter.post("/card/:id/recharge");
cardRouter.post("/card/:id/shoping");
export default cardRouter;