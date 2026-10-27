import OpenAI from "openai";

const apiKey = process.env.NEBIUS_API_KEY;

if (!apiKey) {
  throw new Error("Missing NEBIUS_API_KEY");
}

const client = new OpenAI({
  apiKey,
  baseURL: "https://api.tokenfactory.nebius.com/v1/",
});

const incidentReport = `
During an upstream service degradation, requests began failing with HTTP 503 errors.

The application automatically retried failed requests immediately.
Each failed request could be retried multiple times without a global retry limit.

As traffic increased, retries created even more traffic toward the already-degraded
dependency, amplifying load and making recovery more difficult.
`;

async function main() {
  const response = await client.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    messages: [
      {
        role: "system",
        content: `
You are a senior site reliability engineer analyzing software incidents.

Extract the underlying technical failure mechanism.

Return ONLY valid JSON using this structure:

{
  "failure_pattern": "",
  "trigger": "",
  "mechanism": "",
  "code_smells_to_search_for": [],
  "recommended_test": "",
  "recommended_mitigation": ""
}
        `,
      },
      {
        role: "user",
        content: incidentReport,
      },
    ],
    max_tokens: 1000,
  });

  console.log(response.choices[0]?.message?.content);
}

main().catch(console.error);