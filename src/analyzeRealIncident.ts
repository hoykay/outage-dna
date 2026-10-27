import { tavily } from "@tavily/core";
import OpenAI from "openai";

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

  console.log("✅ Incident found:");
  console.log(githubIncident.title);
  console.log(githubIncident.url);

  console.log("\n🧠 Nemotron analyzing failure mechanism...");

  const response = await nemotron.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    messages: [
      {
        role: "system",
        content: `
You are a senior site reliability engineer.

Analyze a real software incident report and extract the transferable
failure mechanism that could exist in another software system.

Focus on causal technical behavior, not company-specific details.

Return ONLY valid JSON using exactly this structure:

{
  "incident": "",
  "source_url": "",
  "failure_pattern": "",
  "trigger": "",
  "mechanism": "",
  "impact": "",
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

Incident content:
${githubIncident.content}

Extract the underlying failure mechanism.
        `,
      },
    ],
    max_tokens: 1400,
  });

  console.log("\n=== REAL INCIDENT FAILURE DNA ===");
  console.log(response.choices[0]?.message?.content);
}

main().catch(console.error);