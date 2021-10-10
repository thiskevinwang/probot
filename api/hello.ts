import type { VercelRequest, VercelResponse } from "@vercel/node";

import { createNodeMiddleware, createProbot } from "probot";
import { ApplicationFunction } from "probot/lib/types";

import * as handlers from "../handlers";

/**
 * @todo extract
 */
const probot = createProbot({
  defaults: {
    appId: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
    secret: process.env.WEBHOOK_SECRET,
  },
});

const appFn: ApplicationFunction = (app) => {
  // app.on("push", handlers.push);
  // app.on("issues.opened", handlers.issues_opened);
  // app.on("pull_request.reopened", handlers.pull_request_reopened);
  // app.on("pull_request.opened", handlers.pull_request);
  // app.on("pull_request.synchronize", handlers.pull_request);
};

const eventHandler = createNodeMiddleware(appFn, {
  probot,
  webhooksPath: "/api/hello",
});

const handler = async (req: VercelRequest, res: VercelResponse) => {
  eventHandler(req, res);
};

export default handler;
