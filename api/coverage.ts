interface Result {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}

interface Total {
  lines: Result;
  statements: Result;
  functions: Result;
  branches: Result;
}

interface Body {
  owner: string;
  repo: string;
  // workflow YAML will convert this to string ""
  pull_number: string;
  // summary: string; // { total: Total }
  summary: { total: Total };
}

import type { VercelRequest, VercelResponse } from "@vercel/node";

import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";

// const app = new App({
//   appId: process.env.APP_ID!,
//   privateKey: process.env.PRIVATE_KEY!,
// });

// I only passed `appId` and `privateKey` and got the error:
// Error: [@octokit/auth-app] installationId option is required for installation authentication.

// I added `clientId` and `clientSecret` and got the same error
// Now I'm trying `installationId: 123,` and re-rmoving `clientId` & `clientSecret`

// 2021-09-10T04:28:29.281Z	196efc48-4e5a-474d-96b7-ee4a574580f1	ERROR	RequestError [HttpError]: Not Found
//     at /var/task/node_modules/@octokit/request/dist-node/index.js:86:21
//     at processTicksAndRejections (internal/process/task_queues.js:95:5)
//     at getInstallationAuthentication (/var/task/node_modules/@octokit/auth-app/dist-node/index.js:280:7)
//     at hook (/var/task/node_modules/@octokit/auth-app/dist-node/index.js:449:7) {
//   status: 404,
//   response: {
//     url: 'https://api.github.com/app/installations/123/access_tokens',
//     status: 404,

// Now I'm trying 19352502 from https://github.com/settings/installations/19352502

const appOctoKit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: process.env.APP_ID!,
    privateKey: process.env.PRIVATE_KEY!,
    // clientId: process.env.CLIENT_ID!,
    // clientSecret: process.env.CLIENT_SECRET!,
    installationId: 19352502,
  },
});

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const { owner, repo, pull_number, summary }: Body = req.body;

  const t = summary.total;
  try {
    await appOctoKit.request(
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
      {
        owner: owner,
        repo: repo,
        pull_number: parseInt(pull_number),
        body:
          "## Hello\n\n" +
          `
|                | Total                 | Covered                 | Skipped                 | % |
| -------------- | --------------------- | ----------------------- | ----------------------- | --- |
| \`lines\`      | ${t.lines.total}      | ${t.lines.covered}      | ${t.lines.skipped}      | ${t.lines.pct}      |
| \`statements\` | ${t.statements.total} | ${t.statements.covered} | ${t.statements.skipped} | ${t.statements.pct} |
| \`functions\`  | ${t.functions.total}  | ${t.functions.covered}  | ${t.functions.skipped}  | ${t.functions.pct}  |
| \`branches\`   | ${t.branches.total}   | ${t.branches.covered}   | ${t.branches.skipped}   | ${t.branches.pct}   |`,
        event: "COMMENT",
      }
    );
    res.status(200).send("OK!");
  } catch (err) {
    console.error(err);
    res.status(200).json(err);
  }
};

export default handler;

// |     | Total | Covered| Skipped | % |
// | --- | --- | --- | --- | --- |
// | `lines` | ___ | ___ | ___ | ___ |
// | `statements` | ___ | ___ | ___ | ___ |
// | `functions` | ___ | ___ | ___ | ___ |
// | `branches` | ___ | ___ | ___ | ___ |
