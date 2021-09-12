import { Context } from "probot/lib/context";
import {
  EmitterWebhookEvent,
  EmitterWebhookEventName,
} from "@octokit/webhooks";

export type HandlerFunction<TName extends EmitterWebhookEventName> = (
  event: EmitterWebhookEvent<TName> & Context<TName>
) => any;
