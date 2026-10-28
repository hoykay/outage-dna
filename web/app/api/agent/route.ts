import OpenAI from "openai";
import { tavily } from "@tavily/core";
import { readFile } from "fs/promises";
import path from "path";
import { runRetryStormSimulation } from "@/demo/retryStormVulnerable";
import { runPatchedRetryStormSimulation } from "@/demo/retryStormPatched";

const NEBIUS_BASE_URL = "https://api.tokenfactory.nebius.com/v1/";
const NEMOTRON_MODEL = "nvidia/nemotron-3-super-120b-a12b";

function cleanJson(text: string) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Nemotron did not return valid JSON.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function POST() {
  try {
    const nebiusKey = process.env.NEBIUS_API_KEY;
    const tavilyKey = process.env.TAVILY_API_KEY;

    if (!nebiusKey || !tavilyKey) {
      return Response.json(
        {
          success: false,
          error:
            "Missing NEBIUS_API_KEY or TAVILY_API_KEY in the server environment.",
        },
        { status: 500 }
      );
    }

    const nebius = new OpenAI({
      apiKey: nebiusKey,
      baseURL: NEBIUS_BASE_URL,
    });

    // 1. Discover the real incident with Tavily
    const tvly = tavily({
      apiKey: tavilyKey,
    });

    const search = await tvly.search(
      "GitHub August 17 2026 outage retry storm post incident report",
      {
        maxResults: 5,
      }
    );

    const officialIncident =
      search.results.find((result) =>
        result.url.includes("github.blog")
      ) ?? search.results[0];

    if (!officialIncident) {
      throw new Error("Tavily could not find the GitHub incident.");
    }

    // 2. Extract Failure DNA with NVIDIA Nemotron
    const incidentCompletion = await nebius.chat.completions.create({
      model: NEMOTRON_MODEL,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `
You are OutageDNA, a senior software reliability engineering agent.

Read real production incident reports and extract the reusable technical
failure mechanism another engineering team could detect and test inside its
own codebase.

Return ONLY valid JSON. Do not use markdown.
          `.trim(),
        },
        {
          role: "user",
          content: `
Analyze this production outage.

TITLE:
${officialIncident.title}

SOURCE URL:
${officialIncident.url}

REPORT CONTENT:
${officialIncident.content}

Return exactly this JSON shape:

{
  "incident": {
    "provider": "GitHub",
    "title": "string",
    "date": "string",
    "duration": "string",
    "summary": "string",
    "impact": "string",
    "sourceUrl": "string"
  },
  "failureDna": {
    "name": "short failure pattern name",
    "trigger": "string",
    "mechanism": "string",
    "signals": ["string"],
    "recommendedTest": "string",
    "recommendedMitigation": "string"
  }
}

Focus on the retry amplification / retry storm behavior described in the
incident and how it can create cascading load during recovery.
          `.trim(),
        },
      ],
    });

    const incidentContent =
      incidentCompletion.choices[0]?.message?.content;

    if (!incidentContent) {
      throw new Error("Nemotron returned an empty incident analysis.");
    }

    const analysis = cleanJson(incidentContent);

    // 3. Read the real vulnerable demo code
    const codePath = path.join(
      process.cwd(),
      "demo",
      "retryStormVulnerable.ts"
    );

    const vulnerableCode = await readFile(codePath, "utf8");

    // 4. Match Failure DNA against the codebase
    const matchCompletion = await nebius.chat.completions.create({
      model: NEMOTRON_MODEL,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `
You are OutageDNA, a senior software reliability engineer.

Compare a real-world outage failure mechanism against application source code.
Do not flag vague similarities. Only return a match when the code contains the
same technical failure mechanism.

Return ONLY valid JSON. Do not use markdown.
          `.trim(),
        },
        {
          role: "user",
          content: `
REAL-WORLD FAILURE DNA:

${JSON.stringify(analysis.failureDna, null, 2)}

SOURCE FILE:
demo/retryStormVulnerable.ts

CODE:
${vulnerableCode}

Determine whether this code could fail through the same retry-storm mechanism.

Return exactly:

{
  "match": true,
  "confidence": 95,
  "failurePattern": "Retry storm",
  "file": "demo/retryStormVulnerable.ts",
  "evidence": [
    {
      "line": "exact relevant source-code line",
      "reason": "why this line contributes to the same failure mechanism"
    }
  ],
  "explanation": "concise technical explanation",
  "risk": "concise explanation of what happens during upstream degradation"
}

Confidence must be an integer from 0 to 100.

Look specifically for:
- immediate retries after failure
- retries that multiply requests
- missing global retry budget
- missing backoff or jitter
- behavior that can amplify traffic against a degraded upstream service
          `.trim(),
        },
      ],
    });

    const matchContent =
      matchCompletion.choices[0]?.message?.content;

    if (!matchContent) {
      throw new Error("Nemotron returned an empty code match.");
    }

    const exposure = cleanJson(matchContent);

    // 5. Execute the real resilience test
const resilienceTest = runRetryStormSimulation();

// 6. Ask NVIDIA Nemotron for the mitigation
const mitigationCompletion = await nebius.chat.completions.create({
  model: NEMOTRON_MODEL,
  temperature: 0.1,
  messages: [
    {
      role: "system",
      content: `
You are OutageDNA, a senior software reliability engineer.

Given a real outage failure mechanism, vulnerable source code, and a failed
resilience test, recommend the smallest concrete code-level mitigation.

Return ONLY valid JSON. Do not use markdown.
      `.trim(),
    },
    {
      role: "user",
      content: `
FAILURE DNA:
${JSON.stringify(analysis.failureDna, null, 2)}

VULNERABLE CODE:
${vulnerableCode}

EXPOSURE:
${JSON.stringify(exposure, null, 2)}

FAILED RESILIENCE TEST:
${JSON.stringify(resilienceTest, null, 2)}

The fix must prevent uncontrolled retry amplification.

Use a GLOBAL RETRY BUDGET of 200 retries across 100 initial requests.

Return exactly:

{
  "title": "short mitigation title",
  "strategy": "concise explanation",
  "changes": [
    "specific code change"
  ],
  "expectedResult": "concise expected effect",
  "patch": {
    "retryBudget": 200,
    "description": "how the retry budget changes behavior"
  }
}
      `.trim(),
    },
  ],
});

const mitigationContent =
  mitigationCompletion.choices[0]?.message?.content;

if (!mitigationContent) {
  throw new Error("Nemotron returned an empty mitigation.");
}

const mitigation = cleanJson(mitigationContent);

// 7. Verify the mitigation using the same failure scenario
const verification = runPatchedRetryStormSimulation();

    return Response.json({
      success: true,
      discoveredVia: "Tavily",
      analyzedBy: "NVIDIA Nemotron",
      model: NEMOTRON_MODEL,

      source: {
        title: officialIncident.title,
        url: officialIncident.url,
      },

      analysis,
exposure,
resilienceTest,
mitigation,
verification,
    });
  } catch (error) {
    console.error("OutageDNA agent error:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown OutageDNA agent error.",
      },
      { status: 500 }
    );
  }
}