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
  app.on("push", handlers.handlePush);
  app.on("issues.opened", handlers.handleIssuesOpened);
  app.on("pull_request.opened", handlers.handlePullRequest);
  app.on("pull_request.synchronize", handlers.handlePullRequest);
};

const eventHandler = createNodeMiddleware(appFn, {
  probot,
  webhooksPath: "/api/hello",
});

const handler = async (req: VercelRequest, res: VercelResponse) => {
  eventHandler(req, res);
};

export default handler;
