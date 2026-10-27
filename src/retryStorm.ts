const INITIAL_REQUESTS = 100;
const MAX_RETRIES_PER_REQUEST = 1;
const GLOBAL_RETRY_BUDGET = 50;

let totalRequests = 0;
let retriesUsed = 0;

function callUpstream(attempt = 0): void {
  totalRequests++;

  // Simulate an upstream service returning HTTP 503.
  const upstreamFailed = true;

  if (
    upstreamFailed &&
    attempt < MAX_RETRIES_PER_REQUEST &&
    retriesUsed < GLOBAL_RETRY_BUDGET
  ) {
    // Resilient behavior:
    // retries are capped globally so a degraded dependency
    // cannot create runaway request amplification.
    retriesUsed++;
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
console.log(`Retries used: ${retriesUsed}`);
console.log(`Request amplification: ${amplification}x`);

if (amplification > 3) {
  console.log("\n❌ RESILIENCE TEST FAILED");
  console.log("Retry storm detected.");
  throw new Error("Unsafe retry amplification");
}

console.log("\n✅ RESILIENCE TEST PASSED");
console.log("Retry amplification is within the safe limit.");