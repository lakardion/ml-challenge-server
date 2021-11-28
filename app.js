import express from "express";
import chalk from "chalk";
import debug from "debug";
import morgan from "morgan";

const app = express();
const appDebug = debug("app");
app.use(morgan("tiny"));

app.get('/',(req,res)=>{
  res.send('Smoke express app')
})

app.listen(process.env.PORT, () => {
  appDebug(`Running in port ${chalk.green(process.env.PORT)}`);
});
