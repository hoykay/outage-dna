const INITIAL_REQUESTS = 100;
const MAX_RETRIES = 8;
const GLOBAL_RETRY_BUDGET = 200;

export function runPatchedRetryStormSimulation() {
  let totalRequests = 0;
  let retriesUsed = 0;

  function callUpstream(attempt = 0): void {
    totalRequests++;

    // Simulate the same upstream HTTP 503 failure.
    const upstreamFailed = true;

    if (
      upstreamFailed &&
      attempt < MAX_RETRIES &&
      retriesUsed < GLOBAL_RETRY_BUDGET
    ) {
      retriesUsed++;
      callUpstream(attempt + 1);
    }
  }

  for (let i = 0; i < INITIAL_REQUESTS; i++) {
    callUpstream();
  }

  const amplification = totalRequests / INITIAL_REQUESTS;

  return {
    initialRequests: INITIAL_REQUESTS,
    upstreamRequests: totalRequests,
    amplification,
    passed: amplification <= 3,
    retriesUsed,
    retryBudget: GLOBAL_RETRY_BUDGET,
  };
}