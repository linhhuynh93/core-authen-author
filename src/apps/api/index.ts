// tslint:disable:ordered-imports
import "reflect-metadata";

import "module-alias/register";
import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../../../.env` });
import { AppContainer } from "injection/appContainer";
import { Server } from "src/apps/api/server";

process.on("uncaughtException", (err) => {
  console.error(new Date().toUTCString() + " uncaughtException:", err.message);
  console.error(err.stack);
  process.exit(1);
});

const appContainer = new AppContainer();
appContainer.inject();
const server = new Server(appContainer);

server.start();
