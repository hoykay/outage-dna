const INITIAL_REQUESTS = 100;
const MAX_RETRIES = 8;

let totalRequests = 0;

function callUpstream(attempt = 0): void {
  totalRequests++;

  // Simulate an upstream service returning HTTP 503.
  const upstreamFailed = true;

  if (upstreamFailed && attempt < MAX_RETRIES) {
    // Vulnerable behavior:
    // retry immediately with no delay, backoff, jitter, or global retry budget.
    callUpstream(attempt + 1);
  }
}

for (let i = 0; i < INITIAL_REQUESTS; i++) {
  callUpstream();
}

const amplification = totalRequests / INITIAL_REQUESTS;

console.log("=== Resilience Test ===");
console.log(`Initial requests: ${INITIAL_REQUESTS}`);
console.log(`Actual upstream requests: ${totalRequests}`);
console.log(`Request amplification: ${amplification}x`);

if (amplification > 3) {
  console.log("\n❌ RESILIENCE TEST FAILED");
  console.log("Retry storm detected.");
  throw new Error("Unsafe retry amplification");
}

console.log("\n✅ RESILIENCE TEST PASSED");