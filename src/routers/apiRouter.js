import debug from "debug";
import express from "express";
import itemsService from "../services/itemsService.js";
import messageService from "../services/messageService.js";

const apiRouterDebug = debug("app:apiRouter");

const apiRouter = express.Router();

const maxItemsToFetch = 4;

apiRouter.get("/items", async (req, res) => {
  if (req.query?.q) {
    const { q } = req.query;
    const items = await itemsService.getItemsBySearchQuery(q, maxItemsToFetch);
    res.json(items);
  } else {
    const message = "Missing query from request";
    apiRouterDebug(messageService.error("items route")(message));
    res.status(400).send(message);
  }
});

apiRouter.get("/items/:id", async (req, res) => {
  const { id } = req.params;
  const result = await itemsService.getDetailByItemId(id);
  res.json(result);
});

export default apiRouter;
