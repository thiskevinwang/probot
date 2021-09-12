import { HandlerFunction } from "../common/types";

type Fn = HandlerFunction<"pull_request.opened" | "pull_request.synchronize">;

export default <Fn>async function (ctx) {
  const body = `
### ${ctx.name}::${ctx.payload.action}
`;
  // name: pull_request
  // payload.action: opened | synchronize

  await ctx.octokit.request(
    //https://docs.github.com/en/rest/reference/pulls#create-a-review-for-a-pull-request
    "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    {
      owner: ctx.payload.repository.owner.login,
      repo: ctx.payload.repository.name,
      pull_number: ctx.payload.pull_request.number,
      body: body,
      event: "COMMENT",
    }
  );
};
