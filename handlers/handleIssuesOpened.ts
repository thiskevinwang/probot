import { HandlerFunction } from "../common/types";

const addComment = `
mutation comment($id: ID!, $body: String!) {
  addComment(input: {subjectId: $id, body: $body}) {
    clientMutationId
  }
}
`;

export default <HandlerFunction<"issues.opened">>async function (ctx) {
  // Post a comment on the issue
  await ctx.octokit.graphql(addComment, {
    id: ctx.payload.issue.node_id,
    body: "Hello World",
  });
};
