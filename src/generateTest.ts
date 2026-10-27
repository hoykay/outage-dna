import OpenAI from "openai";
import { readFile, writeFile } from "fs/promises";

const apiKey = process.env.NEBIUS_API_KEY;

if (!apiKey) {
  throw new Error("Missing NEBIUS_API_KEY");
}

const client = new OpenAI({
  apiKey,
  baseURL: "https://api.tokenfactory.nebius.com/v1/",
});

async function main() {
  const vulnerableCode = await readFile(
    "src/retryStormVulnerable.ts",
    "utf8"
  );

  const failurePattern = `
Retry storm / cascading overload caused by immediate retries
against a degraded upstream dependency.

Trigger:
The upstream begins returning HTTP 503 errors.

Failure mechanism:
Each failed request is retried repeatedly without a global retry budget,
causing request amplification and making the degraded service even harder
to recover.
`;

  const response = await client.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b",
    messages: [
      {
        role: "system",
        content: `
You are a senior Site Reliability Engineer.

Generate a standalone TypeScript resilience test that proves whether
the supplied code exhibits the described incident failure pattern.

Requirements:
- Use no external testing framework.
- The test must be runnable with Node.js after TypeScript compilation.
- Simulate 100 initial requests.
- Simulate the upstream dependency returning HTTP 503.
- Measure total upstream request attempts.
- Calculate request amplification.
- FAIL when amplification is greater than 3x.
- PASS when amplification is 3x or less.
- Print clear diagnostic output.
- Exit with a non-zero status when the test fails.
- Keep the generated code simple and deterministic.

Return ONLY TypeScript source code.
Do not use Markdown code fences.
Do not explain the code.
        `,
      },
      {
        role: "user",
        content: `
INCIDENT FAILURE PATTERN:

${failurePattern}

APPLICATION CODE:

${vulnerableCode}

Generate the resilience test now.
        `,
      },
    ],
    max_tokens: 1800,
  });

  let generatedCode = response.choices[0]?.message?.content ?? "";

  generatedCode = generatedCode
    .replace(/^```typescript\s*/i, "")
    .replace(/^```ts\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  await writeFile(
    "src/generatedResilienceTest.ts",
    generatedCode,
    "utf8"
  );

  console.log("✅ Nemotron generated:");
  console.log("src/generatedResilienceTest.ts");
}

main().catch(console.error);
