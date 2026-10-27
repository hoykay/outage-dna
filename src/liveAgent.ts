import { tavily } from "@tavily/core";
import OpenAI from "openai";
import { readFile, writeFile } from "fs/promises";
import { spawnSync } from "child_process";

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

async function findIncident() {
  console.log("🔎 Searching for a real incident...");

  const search = await tvly.search(
    "GitHub August 17 2026 outage retry storm retry budgets cascading load",
    {
      searchDepth: "basic",
      maxResults: 5,
      includeAnswer: false,
    }
  );

  const incident = search.results.find((result) =>
    result.url.includes(
      "github.blog/news-insights/company-news/the-august-17-outage"
    )
  );

  if (!incident) {
    throw new Error("GitHub incident report not found");
  }

  console.log("✅ Incident found:");
  console.log(incident.title);
  console.log(incident.url);

  return incident;
}

async function extractFailureDna(incident: {
  title: string;
  url: string;
  content: string;
}) {
  console.log("\n🧠 Extracting failure DNA...");

  const response = await nemotron.chat.completions.create({
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
${incident.title}

Source:
${incident.url}

Content:
${incident.content}
        `,
      },
    ],
    max_tokens: 1200,
  });

  const text = response.choices[0]?.message?.content ?? "";

  const failureDna = JSON.parse(cleanJson(text));

  console.log("✅ Failure DNA extracted:");
  console.log(failureDna.failure_pattern);

  return failureDna;
}

async function matchFailureToCode(failureDna: unknown) {
  console.log("\n📂 Reading application code...");

  const vulnerableCode = await readFile(
    "src/retryStormVulnerable.ts",
    "utf8"
  );

  console.log(
    "🧠 Checking whether the code contains the same failure pattern..."
  );

  const response = await nemotron.chat.completions.create({
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

  const text = response.choices[0]?.message?.content ?? "";

  const matchResult = JSON.parse(cleanJson(text));

  console.log("✅ Code analysis complete:");
  console.log(
    `${matchResult.match ? "MATCH FOUND" : "NO MATCH"} — ${matchResult.confidence}% confidence`
  );

  return {
    vulnerableCode,
    matchResult,
  };
}

async function generateResilienceTest(
  failureDna: unknown
) {
  console.log("\n🧪 Generating resilience test...");

  const response = await nemotron.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    messages: [
      {
        role: "system",
        content: `
You are a senior Site Reliability Engineer.

Generate a standalone TypeScript verification script for this real
incident failure pattern.

The script must:

- Execute src/retryStormVulnerable.ts using npx tsx.
- Capture its stdout and stderr.
- Extract the numeric value from:
  Request amplification: NUMBERx
- Treat amplification greater than 3x as FAIL.
- Treat amplification of 3x or less as PASS.
- Print the measured amplification.
- Exit with status 1 when the resilience test fails.
- Use only Node.js built-in modules.
- Keep the test deterministic.
- Test the ACTUAL application file. Do not recreate or copy its retry logic.

Return ONLY complete TypeScript source code.
Do not use Markdown code fences.
Do not explain anything.
        `,
      },
      {
        role: "user",
        content: `
REAL INCIDENT FAILURE DNA:

${JSON.stringify(failureDna, null, 2)}

Generate the resilience test.
        `,
      },
    ],
    max_tokens: 1800,
  });

  let generatedCode =
    response.choices[0]?.message?.content ?? "";

  generatedCode = generatedCode
    .replace(/^```typescript\s*/i, "")
    .replace(/^```ts\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  await writeFile(
    "src/liveGeneratedResilienceTest.ts",
    generatedCode,
    "utf8"
  );

  console.log("✅ Resilience test generated");

  return "src/liveGeneratedResilienceTest.ts";
}

function runResilienceTest(testFile: string) {
  console.log("\n⚡ Running generated resilience test...");

  const result = spawnSync(
    "npx",
    ["tsx", testFile],
    {
      encoding: "utf8",
    }
  );

  const output =
    `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();

  console.log(output);

  const amplificationMatch = output.match(
  /(?:Request|Measured)\s+amplification:\s*([0-9.]+)x/i
);

  if (!amplificationMatch) {
    throw new Error(
      "Generated test did not report request amplification"
    );
  }

  const amplification = Number(amplificationMatch[1]);
  const passed = amplification <= 3;

  console.log(
    `\n${passed ? "✅ PASS" : "❌ FAIL"} — measured ${amplification}x amplification`
  );

  return {
    amplification,
    passed,
    output,
  };
}

async function generateMitigationPatch(
  failureDna: unknown,
  vulnerableCode: string
) {
  console.log("\n🛠️ Generating mitigation patch...");

  const response = await nemotron.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    messages: [
      {
        role: "system",
        content: `
You are a senior Site Reliability Engineer.

Repair the supplied TypeScript code so it no longer exhibits the
failure mechanism learned from the real production incident.

Requirements:
- Keep the program simple and deterministic.
- Preserve the original behavior as much as possible.
- Prevent request amplification from exceeding 3x.
- Add a global retry budget.
- Keep retries bounded per request.
- Do not add external dependencies.
- Keep the same resilience metric output.
- The patched code must remain valid runnable TypeScript.
- Do NOT use setTimeout, sleep, timers, or real waiting.
- If backoff is needed, simulate it logically without delaying execution.

Return ONLY the complete patched TypeScript source code.
Do not use Markdown code fences.
Do not explain anything.
        `,
      },
      {
        role: "user",
        content: `
REAL INCIDENT FAILURE DNA:

${JSON.stringify(failureDna, null, 2)}

VULNERABLE APPLICATION CODE:

${vulnerableCode}

Generate the repaired version.
        `,
      },
    ],
    max_tokens: 1800,
  });

  let patchedCode =
    response.choices[0]?.message?.content ?? "";

  patchedCode = patchedCode
    .replace(/^```typescript\s*/i, "")
    .replace(/^```ts\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  await writeFile(
    "src/livePatchedService.ts",
    patchedCode,
    "utf8"
  );

  console.log("✅ Mitigation patch generated");

  return "src/livePatchedService.ts";
}

async function verifyMitigationWithSameTest(
  originalTestFile: string,
  patchedFile: string
) {
  console.log("\n🔁 Verifying patch with the same resilience test...");

  const originalTest = await readFile(
    originalTestFile,
    "utf8"
  );

  const patchedTest = originalTest.replace(
    "src/retryStormVulnerable.ts",
    patchedFile
  );

  if (patchedTest === originalTest) {
    throw new Error(
      "Could not retarget generated resilience test to patched service"
    );
  }

  const patchedTestFile =
    "src/livePatchedResilienceTest.ts";

  await writeFile(
    patchedTestFile,
    patchedTest,
    "utf8"
  );

  const result = runResilienceTest(
    patchedTestFile
  );

  if (!result.passed) {
    throw new Error(
      `Mitigation failed verification at ${result.amplification}x amplification`
    );
  }

  console.log(
    "✅ PATCH VERIFIED — the same resilience test now passes"
  );

  return result;
}

async function main() {
  console.log("\n======================================");
  console.log("🚨 INCIDENT → RESILIENCE AGENT");
  console.log("======================================");

  // 1. Find a real production incident.
  const incident = await findIncident();

  // 2. Learn the transferable failure mechanism.
  const failureDna = await extractFailureDna(incident);

  // 3. Check whether our application has the same weakness.
  const { vulnerableCode, matchResult } =
    await matchFailureToCode(failureDna);

  if (!matchResult.match) {
    console.log(
      "\n✅ No matching failure pattern found in the application."
    );
    return;
  }

  console.log(
    `\n⚠️ EXPOSURE FOUND — ${matchResult.confidence}% confidence`
  );

  // 4. Generate a resilience test from the real incident.
  const testFile =
    await generateResilienceTest(failureDna);

  // 5. Prove the vulnerability.
  const before = runResilienceTest(testFile);

  if (before.passed) {
    throw new Error(
      "Expected vulnerable application to fail the resilience test"
    );
  }

  console.log(
    `\n❌ BEFORE PATCH: ${before.amplification}x amplification`
  );

  // 6. Generate a mitigation.
  const patchedFile =
    await generateMitigationPatch(
      failureDna,
      vulnerableCode
    );

  // 7. Run the SAME resilience test against the patch.
  const after =
    await verifyMitigationWithSameTest(
      testFile,
      patchedFile
    );

  console.log("\n======================================");
  console.log("🏆 RESILIENCE IMPROVEMENT VERIFIED");
  console.log("======================================");
  console.log(
    `Before: ${before.amplification}x amplification ❌`
  );
  console.log(
    `After:  ${after.amplification}x amplification ✅`
  );
  console.log(`Source: ${incident.url}`);
  console.log(
    "\nLearned from a real outage before it became ours."
  );
}

main().catch((error) => {
  console.error("\n❌ Agent failed:");
  console.error(error);
  process.exitCode = 1;
});