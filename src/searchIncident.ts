import { tavily } from "@tavily/core";

const apiKey = process.env.TAVILY_API_KEY;

if (!apiKey) {
  throw new Error("Missing TAVILY_API_KEY");
}

const tvly = tavily({ apiKey });

async function main() {
  const response = await tvly.search(
    "GitHub August 17 2026 outage retry storm retry budgets cascading load",
    {
      searchDepth: "basic",
      maxResults: 5,
      includeAnswer: false,
    }
  );

  console.log("=== Tavily Incident Search ===");

  for (const result of response.results) {
    console.log("\nTITLE:", result.title);
    console.log("URL:", result.url);
    console.log("CONTENT:", result.content);
  }
}

main().catch(console.error);