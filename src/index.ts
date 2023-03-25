/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;

  BASE_URL: string;
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestUrl = new URL(request.url);
    let someHost = "https://bento.me";
    const path = requestUrl.pathname;

    if (path.includes("v1")) {
      someHost = "https://api.bento.me";
    }

    let url = someHost + requestUrl.pathname;
    if (url === "https://bento.me/") {
      url = "https://bento.me/mertbekci";
    }

    const init = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "content-type": "text/plain;charset=UTF-8",
      },
    };
    async function gatherResponse(response: Response, contentType: string) {
      if (contentType.includes("application/json")) {
        return JSON.stringify(await response.json());
      } else if (contentType.includes("application/text")) {
        return response.text();
      } else if (contentType.includes("text/html")) {
        return response.text();
      } else {
        return response.text();
      }
    }

    const response = await fetch(url, init);
    const contentType = response.headers.get("content-type")!;
    let results = await gatherResponse(response, contentType);
    results = results.replaceAll("https://api.bento.me", env.BASE_URL);

    init.headers["content-type"] = contentType;
    return new Response(results, init);
  },
};
