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

Your job is to repair the supplied TypeScript code so it no longer
exhibits the described incident failure pattern.

Requirements:
- Preserve the original program behavior as much as possible.
- Prevent retry amplification from exceeding 3x.
- Add a global retry budget.
- Keep retries bounded per request.
- Keep the code simple and deterministic.
- Do not add external dependencies.
- The patched code must remain runnable TypeScript.
- Print the same resilience metrics:
  initial requests,
  actual upstream requests,
  retries used,
  request amplification.
- Print PASS when amplification is 3x or less.
- Throw an error if amplification still exceeds 3x.

Return ONLY the complete patched TypeScript source code.
Do not use Markdown code fences.
Do not explain the changes.
        `,
      },
      {
        role: "user",
        content: `
INCIDENT FAILURE PATTERN:

${failurePattern}

VULNERABLE APPLICATION CODE:

${vulnerableCode}

Generate the repaired version now.
        `,
      },
    ],
    max_tokens: 1800,
  });

  let patchedCode = response.choices[0]?.message?.content ?? "";

  patchedCode = patchedCode
    .replace(/^```typescript\s*/i, "")
    .replace(/^```ts\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  await writeFile(
    "src/retryStormPatched.ts",
    patchedCode,
    "utf8"
  );

  console.log("✅ Nemotron generated mitigation patch:");
  console.log("src/retryStormPatched.ts");
}

main().catch(console.error);