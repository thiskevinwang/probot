import { HandlerFunction } from "../common/types";

type Fn = HandlerFunction<"pull_request.opened" | "pull_request.synchronize">;

export default <Fn>async function (ctx) {
  const body = `
### ${ctx.name}::${ctx.payload.action}
`;
  // name: pull_request
  // payload.action: opened | synchronize
  const comments = await ctx.octokit.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner: ctx.payload.repository.owner.login,
      repo: ctx.payload.repository.name,
      issue_number: ctx.payload.pull_request.number,
    }
  );

  const previous = comments.data.find(
    (e) => e.user?.login === "coverage-buddy[bot]"
  );

  if (previous) {
    // update
    await ctx.octokit.request(
      "PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}",
      {
        owner: ctx.payload.repository.owner.login,
        repo: ctx.payload.repository.name,
        comment_id: previous.id,
        body: body,
      }
    );
  } else {
    // create new
    await ctx.octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: ctx.payload.repository.owner.login,
        repo: ctx.payload.repository.name,
        issue_number: ctx.payload.pull_request.number,
        body: body,
      }
    );
  }

  // await ctx.octokit.request(
  //   //https://docs.github.com/en/rest/reference/pulls#create-a-review-for-a-pull-request
  //   "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
  //   {
  //     owner: ctx.payload.repository.owner.login,
  //     repo: ctx.payload.repository.name,
  //     pull_number: ctx.payload.pull_request.number,
  //     body: body,
  //     event: "COMMENT",
  //   }
  // );
};
