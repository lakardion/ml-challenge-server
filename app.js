import express from "express";
import chalk from "chalk";
import debug from "debug";
import morgan from "morgan";
import apiRouter from "./src/routers/apiRouter.js";

const app = express();
const appDebug = debug("app");
app.use(morgan("tiny"));
app.use(express.json());

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  appDebug(`Running in port ${chalk.green(process.env.PORT)}`);
});
