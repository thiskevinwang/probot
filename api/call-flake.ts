import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "isomorphic-fetch";

const endpoint = "https://probot-flame.vercel.app/api/flake?threshold=70";

const fetchretry = async (
  url: string,
  { maxRetries = 3, retryCount = 0, delay = 10 } = {}
): Promise<Response> => {
  console.log(". ".repeat(retryCount), "fetchretry", {
    maxRetries,
    retryCount,
  });

  let res = await fetch(endpoint);

  if (retryCount > maxRetries) {
    return res;
  }

  if ((res.status >= 500 && res.status < 600) || res.status === 429) {
    const retryAfter = delay * 2;

    await new Promise((r) => setTimeout(r, retryAfter));

    res = await fetchretry(url, {
      retryCount: retryCount + 1,
      delay: retryAfter,
    });
  }

  return res;
};

const handler = async (req: VercelRequest, res: VercelResponse) => {
  console.log(req.url);
  try {
    const response = await fetchretry(endpoint);
    const text = await response.text();
    return res.status(response.status).send(text);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

export default handler;
