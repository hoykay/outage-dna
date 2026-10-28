const INITIAL_REQUESTS = 100;
const MAX_RETRIES = 8;

export function runRetryStormSimulation() {
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

  return {
    initialRequests: INITIAL_REQUESTS,
    upstreamRequests: totalRequests,
    amplification,
    passed: amplification <= 3,
    failurePattern:
      amplification > 3 ? "Retry storm detected" : null,
  };
}