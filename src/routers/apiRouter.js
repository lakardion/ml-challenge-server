import express from "express";
import debug from "debug";
import itemsService from "../services/itemsService.js";
import chalk from "chalk";

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
    apiRouterDebug(`${chalk.red("[ERROR]")} -- ${message}`);
    res.status(400).send(message);
  }
});

export default apiRouter;
