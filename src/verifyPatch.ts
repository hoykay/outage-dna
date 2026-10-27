import { spawnSync } from "child_process";

const SAFE_AMPLIFICATION_LIMIT = 3;

type Result = {
  file: string;
  amplification: number;
  passed: boolean;
  output: string;
};

function testFile(file: string): Result {
  const result = spawnSync(
    "npx",
    ["tsx", file],
    {
      encoding: "utf8",
    }
  );

  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;

  const match = output.match(
    /Request amplification:\s*([0-9.]+)x/
  );

  if (!match) {
    throw new Error(
      `Could not find amplification result for ${file}`
    );
  }

  const amplification = Number(match[1]);

  return {
    file,
    amplification,
    passed: amplification <= SAFE_AMPLIFICATION_LIMIT,
    output,
  };
}

function printResult(label: string, result: Result) {
  console.log(`\n=== ${label} ===`);
  console.log(`File: ${result.file}`);
  console.log(`Request amplification: ${result.amplification}x`);

  if (result.passed) {
    console.log("✅ RESILIENCE TEST PASSED");
  } else {
    console.log("❌ RESILIENCE TEST FAILED");
  }
}

const vulnerable = testFile(
  "src/retryStormVulnerable.ts"
);

const patched = testFile(
  "src/retryStormPatched.ts"
);

console.log("=== SAME RESILIENCE TEST ===");
console.log(
  `Safe amplification limit: ${SAFE_AMPLIFICATION_LIMIT}x`
);

printResult("BEFORE PATCH", vulnerable);
printResult("AFTER PATCH", patched);

console.log("\n=== VERIFICATION ===");

if (!vulnerable.passed && patched.passed) {
  console.log(
    "✅ PATCH VERIFIED: the same resilience test failed before the patch and passed after it."
  );
} else {
  console.log(
    "❌ PATCH NOT VERIFIED: expected FAIL before and PASS after."
  );
  process.exitCode = 1;
}