import type { VercelRequest, VercelResponse } from "@vercel/node";

import { createNodeMiddleware, createProbot } from "probot";
import { ApplicationFunction } from "probot/lib/types";

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

/**
 * @todo extract
 */
const appFn: ApplicationFunction = (app) => {
  app.on(["push"], async (ctx) => {
    console.log(ctx.payload.repository.name);
    return "push_TEST";
  });
  const addComment = `
mutation comment($id: ID!, $body: String!) {
  addComment(input: {subjectId: $id, body: $body}) {
    clientMutationId
  }
}
`;
  // from the docs
  app.on("issues.opened", async (ctx) => {
    // Post a comment on the issue
    await ctx.octokit.graphql(addComment, {
      id: ctx.payload.issue.node_id,
      body: "Hello World",
    });
  });
  app.on("pull_request.opened", async (ctx) => {
    await ctx.octokit.request(
      //https://docs.github.com/en/rest/reference/pulls#create-a-review-for-a-pull-request
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
      {
        owner: ctx.payload.repository.owner.login,
        repo: ctx.payload.repository.name,
        pull_number: ctx.payload.pull_request.number,
        body: `
### \`pull_request.opened\`

${ctx.name}
`,
        event: "COMMENT",
      }
    );
  });
  app.on("pull_request.synchronize", async (ctx) => {
    await ctx.octokit.request(
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
      {
        owner: ctx.payload.repository.owner.login,
        repo: ctx.payload.repository.name,
        pull_number: ctx.payload.pull_request.number,
        body: `
### \`pull_request.synchronize\`

- ${ctx.name}
`,
        event: "COMMENT",
      }
    );
  });
};

const eventHandler = createNodeMiddleware(appFn, {
  probot,
  webhooksPath: "/api/hello",
});

const handler = async (req: VercelRequest, res: VercelResponse) => {
  eventHandler(req, res);
};

export default handler;
