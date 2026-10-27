import OpenAI from "openai";
import { readFile } from "fs/promises";

const apiKey = process.env.NEBIUS_API_KEY;

if (!apiKey) {
  throw new Error("Missing NEBIUS_API_KEY");
}

const client = new OpenAI({
  apiKey,
  baseURL: "https://api.tokenfactory.nebius.com/v1/",
});

async function main() {
  const code = await readFile("src/retryStormVulnerable.ts", "utf8");

  const failurePattern = {
    failure_pattern:
      "Retry storm / cascading overload caused by unbounded immediate retries on a degraded dependency",
    trigger: "Upstream service begins returning HTTP 503 errors during degradation",
    mechanism:
      "Application retries each failed request instantly and without a global limit, causing retry traffic to amplify load on the unhealthy dependency",
    code_smells_to_search_for: [
      "Immediate retries",
      "No retry budget",
      "No backoff or jitter",
      "Large retry count",
      "No circuit breaker",
    ],
  };

  const response = await client.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    messages: [
      {
        role: "system",
        content: `
You are a senior reliability engineer.

Your job is to determine whether source code contains the same failure pattern described in an incident analysis.

Return ONLY valid JSON using this structure:

{
  "match": true,
  "confidence": 0,
  "matched_failure_pattern": "",
  "evidence": [
    {
      "code": "",
      "why_it_matters": ""
    }
  ],
  "risk_summary": "",
  "recommended_change": ""
}

confidence must be an integer from 0 to 100.
Do not invent evidence that is not present in the code.
        `,
      },
      {
        role: "user",
        content: `
INCIDENT FAILURE PATTERN:

${JSON.stringify(failurePattern, null, 2)}

SOURCE CODE:

${code}
        `,
      },
    ],
    max_tokens: 1200,
  });

  console.log(response.choices[0]?.message?.content);
}

main().catch(console.error);