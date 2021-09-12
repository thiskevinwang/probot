import { HandlerFunction } from "../common/types";

type Fn = HandlerFunction<"pull_request.reopened">;

export default <Fn>async function (ctx) {
  const body = `
### ${ctx.name}::${ctx.payload.action}
`;

  await ctx.octokit.request(
    //https://docs.github.com/en/rest/reference/pulls#create-a-review-for-a-pull-request
    "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    {
      owner: ctx.payload.repository.owner.login,
      repo: ctx.payload.repository.name,
      pull_number: ctx.payload.number,
      body: body,
      event: "COMMENT",
    }
  );
};
