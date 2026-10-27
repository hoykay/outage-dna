import { tavily } from "@tavily/core";
import OpenAI from "openai";
import { readFile } from "fs/promises";

const tavilyApiKey = process.env.TAVILY_API_KEY;
const nebiusApiKey = process.env.NEBIUS_API_KEY;

if (!tavilyApiKey) {
  throw new Error("Missing TAVILY_API_KEY");
}

if (!nebiusApiKey) {
  throw new Error("Missing NEBIUS_API_KEY");
}

const tvly = tavily({
  apiKey: tavilyApiKey,
});

const nemotron = new OpenAI({
  apiKey: nebiusApiKey,
  baseURL: "https://api.tokenfactory.nebius.com/v1/",
});

function cleanJson(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function main() {
  console.log("🔎 Searching for real incident...");

  const search = await tvly.search(
    "GitHub August 17 2026 outage retry storm retry budgets cascading load",
    {
      searchDepth: "basic",
      maxResults: 5,
      includeAnswer: false,
    }
  );

  const githubIncident = search.results.find((result) =>
    result.url.includes(
      "github.blog/news-insights/company-news/the-august-17-outage"
    )
  );

  if (!githubIncident) {
    throw new Error("GitHub incident report not found");
  }

  console.log("✅ Real incident found:");
  console.log(githubIncident.title);
  console.log(githubIncident.url);

  console.log("\n🧠 Extracting failure DNA...");

  const extraction = await nemotron.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    messages: [
      {
        role: "system",
        content: `
You are a senior site reliability engineer.

Analyze the supplied real incident report and extract the transferable
technical failure mechanism.

Return ONLY valid JSON using exactly this structure:

{
  "failure_pattern": "",
  "trigger": "",
  "mechanism": "",
  "code_smells_to_search_for": [],
  "recommended_resilience_test": "",
  "recommended_mitigation": ""
}
        `,
      },
      {
        role: "user",
        content: `
REAL INCIDENT:

Title:
${githubIncident.title}

Source:
${githubIncident.url}

Content:
${githubIncident.content}
        `,
      },
    ],
    max_tokens: 1200,
  });

  const failureDnaText =
    extraction.choices[0]?.message?.content ?? "";

  const failureDna = JSON.parse(
    cleanJson(failureDnaText)
  );

  console.log("✅ Failure DNA extracted:");
  console.log(failureDna.failure_pattern);

  console.log("\n📂 Reading application code...");

  const vulnerableCode = await readFile(
    "src/retryStormVulnerable.ts",
    "utf8"
  );

  console.log("🧠 Checking whether the code contains the same failure...");

  const matchResponse = await nemotron.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    messages: [
      {
        role: "system",
        content: `
You are a senior reliability engineer.

Determine whether the supplied application code contains the same
failure mechanism learned from a real production incident.

Return ONLY valid JSON using exactly this structure:

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
  "recommended_next_action": ""
}

Rules:
- confidence must be an integer from 0 to 100.
- Do not invent evidence.
- Cite only code that actually exists in the supplied source.
        `,
      },
      {
        role: "user",
        content: `
REAL INCIDENT FAILURE DNA:

${JSON.stringify(failureDna, null, 2)}

APPLICATION CODE:

${vulnerableCode}
        `,
      },
    ],
    max_tokens: 1400,
  });

  console.log("\n=== INCIDENT → CODE MATCH ===");
  console.log(matchResponse.choices[0]?.message?.content);
}

main().catch(console.error);