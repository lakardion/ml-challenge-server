import chalk from "chalk";

const error =
  (callerName) =>
  (error, message = "") =>
    `${chalk.red("[ERROR] " + callerName)} -- ${
      message ? message : "Something went wrong"
    }
  ${error ? ": " + error.message : ""}`;
const success = (callerName) => (message) =>
  `${chalk.green("[SUCCESS] " + callerName)} -- ${message}`;

export default { error, success };
