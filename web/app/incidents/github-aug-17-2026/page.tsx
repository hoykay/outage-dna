"use client";

import { useState } from "react";

import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  History,
  Play,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const steps = [
  "Incident",
  "Failure DNA",
  "Exposure",
  "Resilience Test",
  "Mitigation",
  "Verified",
];

export default function IncidentInvestigationPage() {
    const [isRunning, setIsRunning] = useState(false);
  const [agentResult, setAgentResult] = useState<any>(null);
  const [agentError, setAgentError] = useState<string | null>(null);

  async function runAgent() {
  try {
    setIsRunning(true);
    setAgentError(null);

    const response = await fetch("/api/agent", {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "OutageDNA agent failed.");
    }

    setAgentResult(data);
  } catch (error) {
    setAgentError(
      error instanceof Error ? error.message : "Something went wrong."
    );
  } finally {
    setIsRunning(false);
  }
}

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#111318]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-[#E5E7EB] bg-white">
          <div className="flex h-16 items-center border-b border-[#E5E7EB] px-6">
            <div className="text-[19px] font-semibold tracking-[-0.02em]">
              <span>Outage</span>
              <span className="text-[#3157D5]">DNA</span>
            </div>
          </div>

          <nav className="flex-1 px-3 py-5">
            <div className="space-y-1">
              <a
                href="/"
                className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-[#667085] hover:bg-[#F7F8FA] hover:text-[#111318]"
              >
                <Activity size={17} strokeWidth={1.8} />
                Overview
              </a>

              <a
                href="/incidents"
                className="flex h-10 items-center gap-3 rounded-md bg-[#EEF2FF] px-3 text-sm font-medium text-[#3157D5]"
              >
                <Search size={17} strokeWidth={1.8} />
                Incidents
              </a>

              <a
                href="/runs"
                className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-[#667085] hover:bg-[#F7F8FA] hover:text-[#111318]"
              >
                <History size={17} strokeWidth={1.8} />
                Runs
              </a>
            </div>
          </nav>

          <div className="border-t border-[#E5E7EB] px-4 py-5">
            <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">
              Demo target
            </p>

            <div className="flex items-center gap-3 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white">
                <GitBranch size={16} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-sm font-medium text-[#344054]">
  retryStormVulnerable.ts
</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#12B76A]" />
                  <span className="text-xs text-[#98A2B3]">Demo codebase</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="ml-60 flex-1">
          <div className="mx-auto max-w-[1180px] px-10 py-8">
            {/* Back */}
            <a
              href="/incidents"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#667085] hover:text-[#111318]"
            >
              <ArrowLeft size={15} />
              Back to incidents
            </a>

            {/* Incident header */}
            <div className="mt-5 flex items-start justify-between gap-10">
              <div className="max-w-[760px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E5E7EB] bg-white">
                    <GitBranch size={19} />
                  </div>

                  <h1 className="text-[28px] font-semibold tracking-[-0.03em]">
                    GitHub — August 17, 2026
                  </h1>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  Client-side retry behavior amplified traffic during recovery,
                  increasing load on already degraded services and contributing
                  to a cascading outage.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#667085]">
                  <span>Official post-incident report</span>
                  <span>·</span>
                  <span>Discovered via Tavily</span>
                  <span>·</span>
                  <a
                    href="https://github.blog/news-insights/company-news/the-august-17-outage-and-the-work-ahead"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[#3157D5]"
                  >
                    github.blog
                    <ExternalLink size={11} />
                  </a>
                </div>
                <button
  onClick={runAgent}
  disabled={isRunning}
  className="mt-5 flex h-10 items-center gap-2 rounded-md bg-[#111318] px-4 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
>
  <Play size={14} fill="currentColor" />
  {isRunning ? "Running OutageDNA..." : "Run resilience test"}
</button>
              </div>

              <div className="w-[230px] border border-[#E5E7EB] bg-white">
                <div className="grid grid-cols-2 border-b border-[#E5E7EB] px-4 py-3 text-xs">
                  <span className="text-[#98A2B3]">Duration</span>
                  <span className="font-medium text-[#344054]">7h 47m</span>
                </div>

                <div className="grid grid-cols-2 border-b border-[#E5E7EB] px-4 py-3 text-xs">
                  <span className="text-[#98A2B3]">Impact</span>
                  <span className="font-medium text-[#344054]">
                    Multiple services
                  </span>
                </div>

                <div className="grid grid-cols-2 border-b border-[#E5E7EB] px-4 py-3 text-xs">
                  <span className="text-[#98A2B3]">Root cause</span>
                  <span className="font-medium text-[#344054]">
                    Retry storm
                  </span>
                </div>

                <div className="grid grid-cols-2 px-4 py-3 text-xs">
                  <span className="text-[#98A2B3]">Source</span>
                  <span className="font-medium text-[#344054]">
                    github.blog
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-8 border-y border-[#E5E7EB] bg-white px-5 py-4">
              <div className="flex items-center">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex flex-1 items-center last:flex-none"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                          agentResult || index === 0
                            ? "bg-[#3157D5] text-white"
                            : "bg-[#F2F4F7] text-[#667085]"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <span
                        className={`text-xs font-medium ${
                          agentResult || index === 0
                            ? "text-[#3157D5]"
                            : "text-[#667085]"
                        }`}
                      >
                        {step}
                      </span>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="mx-4 h-px flex-1 bg-[#E5E7EB]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main investigation grid */}
            <div
              className="mt-6 grid gap-6"
              style={{ gridTemplateColumns: "220px minmax(0, 1fr)" }}
            >
              {/* Stage navigation */}
              <aside className="border-r border-[#E5E7EB] pr-5">
                <div className="space-y-1">
                  {steps.map((step, index) => (
                    <div
                      key={step}
                      className={`flex gap-3 rounded-md px-3 py-3 ${
                        agentResult || index === 0 ? "bg-[#EEF2FF]" : ""
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                          agentResult || index === 0
                            ? "bg-[#3157D5] text-white"
                            : "bg-[#F2F4F7] text-[#667085]"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div>
                        <p
                          className={`text-sm font-medium ${
                            agentResult || index === 0
                              ? "text-[#3157D5]"
                              : "text-[#344054]"
                          }`}
                        >
                          {step}
                        </p>

                        <p className="mt-0.5 text-[11px] leading-4 text-[#98A2B3]">
                          {
                            [
                              "Understand the incident",
                              "Extract the failure pattern",
                              "Find similar risks in your code",
                              "Prove the vulnerability exists",
                              "Generate a concrete fix",
                              "Confirm the improvement",
                            ][index]
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>

              {/* Content */}
              <div className="min-w-0">
                {/* Failure DNA */}
                <section className="border-b border-[#E5E7EB] pb-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                        Failure DNA
                      </p>

                      <h2 className="mt-2 text-[19px] font-semibold">
                        {agentResult ? agentResult.analysis.failureDna.name : "—"}
                      </h2>
                    </div>

                    <span className="text-xs text-[#667085]">
                      Extracted by NVIDIA Nemotron
                    </span>
                  </div>

                  <div
                    className="mt-5 grid gap-6"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                  >
                    <div>
                      <p className="text-xs font-medium text-[#98A2B3]">
                        Trigger
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#344054]">
                        {agentResult ? agentResult.analysis.failureDna.trigger : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[#98A2B3]">
                        Mechanism
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#344054]">
                        {agentResult ? agentResult.analysis.failureDna.mechanism : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[#98A2B3]">
                        Signals
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#344054]">
                        {agentResult
  ? agentResult.analysis.failureDna.signals.join(" · ")
  : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[#98A2B3]">
                        Recommended test
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#344054]">
                        {agentResult
  ? agentResult.analysis.failureDna.recommendedTest
  : "—"}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Exposure */}
                <section className="border-b border-[#E5E7EB] py-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                        Exposure
                      </p>

                      <h2 className="mt-2 text-[19px] font-semibold">
                        {agentResult
  ? `${agentResult.exposure.failurePattern} found in your codebase`
  : "—"}
                      </h2>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[#98A2B3]">Match confidence</p>
                      <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
                        {agentResult ? `${agentResult.exposure.confidence}%` : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden border border-[#E5E7EB] bg-[#FBFCFE]">
                    <div className="border-b border-[#E5E7EB] bg-white px-4 py-2.5 font-mono text-xs text-[#667085]">
                      {agentResult ? agentResult.exposure.file : "—"}
                    </div>

                    <div className="px-4 py-4 font-mono text-[13px] leading-6">
                      <div className="flex">
                        <span className="mr-5 w-5 text-right text-[#98A2B3]">
                          10
                        </span>
                        <span>
                          async function callUpstream(attempt: number) {"{"}
                        </span>
                      </div>

                      <div className="flex">
                        <span className="mr-5 w-5 text-right text-[#98A2B3]">
                          11
                        </span>
                        <span className="pl-4">
                          if (upstreamFailed &amp;&amp; attempt &lt; MAX_RETRIES)
                          {" {"}
                        </span>
                      </div>

                      <div className="flex bg-[#FFF1F0] text-[#D92D20]">
                        <span className="mr-5 w-5 text-right text-[#98A2B3]">
                          12
                        </span>
                        <span className="pl-8">
                          {agentResult ? agentResult.exposure.evidence[0]?.line : "—"}
                        </span>
                      </div>

                      <div className="flex">
                        <span className="mr-5 w-5 text-right text-[#98A2B3]">
                          13
                        </span>
                        <span className="pl-4">{"}"}</span>
                      </div>

                      <div className="flex">
                        <span className="mr-5 w-5 text-right text-[#98A2B3]">
                          14
                        </span>
                        <span>{"}"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-l-2 border-[#D92D20] pl-4">
                    <p className="text-sm font-medium text-[#344054]">
                      Why this matters
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#667085]">
                      {agentResult ? agentResult.exposure.explanation : "—"}
                    </p>
                  </div>
                </section>

                {/* Resilience Test */}
                <section className="border-b border-[#E5E7EB] py-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                        Resilience test
                      </p>

                      <h2 className="mt-2 text-[19px] font-semibold">
                        Prove the vulnerability
                      </h2>
                    </div>

                    
                  </div>

                  {agentResult && (
  <div className="mt-4 flex items-center gap-2 border border-[#A6F4C5] bg-[#ECFDF3] px-4 py-3 text-sm font-medium text-[#027A48]">
    <CheckCircle2 size={16} />
    Live agent completed: {agentResult.exposure.confidence}% match ·{" "}
    {agentResult.resilienceTest.amplification}× FAIL →{" "}
    {agentResult.verification.amplification}× PASS
  </div>
)}

{agentError && (
  <div className="mt-4 flex items-center gap-2 border border-[#FECACA] bg-[#FFF1F0] px-4 py-3 text-sm font-medium text-[#D92D20]">
    <XCircle size={16} />
    {agentError}
  </div>
)}

                  <p className="mt-2 text-sm text-[#667085]">
                    Incident-specific test derived from the GitHub failure
pattern.
                  </p>

                  <div
                    className="mt-5 grid gap-4"
                    style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
                  >
                    <div className="border border-[#E5E7EB] bg-white px-5 py-5">
                      <p className="text-xs text-[#98A2B3]">
                        Initial requests
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
  {agentResult
    ? agentResult.resilienceTest.initialRequests
    : "—"}
</p>
                    </div>

                    <div className="border border-[#E5E7EB] bg-white px-5 py-5">
                      <p className="text-xs text-[#98A2B3]">
                        Upstream requests
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
  {agentResult
    ? agentResult.resilienceTest.upstreamRequests
    : "—"}
</p>
                    </div>

                    <div className="border border-[#FECACA] bg-[#FFF8F7] px-5 py-5">
                      <p className="text-xs text-[#D92D20]">
                        Request amplification
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-[#D92D20]">
                        {agentResult
  ? `${agentResult.resilienceTest.amplification}×`
  : "—"}
                      </p>
                    </div>
                  </div>

                  {agentResult && !agentResult.resilienceTest.passed && (
  <div className="mt-4 flex items-center gap-3 border border-[#FECACA] bg-[#FFF8F7] px-4 py-3">
    <XCircle size={18} className="text-[#D92D20]" />

    <div>
      <p className="text-sm font-semibold text-[#D92D20]">
        Test failed
      </p>

      <p className="mt-0.5 text-xs text-[#667085]">
        The retry-storm vulnerability was reproduced in your code.
      </p>
    </div>
  </div>
)}
                </section>

                {/* Mitigation */}
                <section
  className={`${agentResult ? "" : "hidden"} border-b border-[#E5E7EB] py-7`}
>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                        Mitigation
                      </p>

                      <h2 className="mt-2 text-[19px] font-semibold">
                        {agentResult ? agentResult.mitigation.title : "—"}
                      </h2>
                    </div>

                    <span className="text-xs text-[#667085]">
                      Generated by NVIDIA Nemotron
                    </span>
                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                    {agentResult ? agentResult.mitigation.strategy : "—"}
                  </p>

                  <div className="mt-5 overflow-hidden border border-[#E5E7EB] bg-[#FBFCFE]">
                    <div className="border-b border-[#E5E7EB] bg-white px-4 py-2.5 font-mono text-xs text-[#667085]">
                      demo/retryStormPatched.ts
                    </div>

                    <div className="px-4 py-4 font-mono text-[13px] leading-6">
                      <div className="flex bg-[#ECFDF3] text-[#027A48]">
                        <span className="mr-5 w-5 text-right text-[#98A2B3]">
                          +
                        </span>
                        <span>
                          const GLOBAL_RETRY_BUDGET = INITIAL_REQUESTS * 2;
                        </span>
                      </div>

                      <div className="flex bg-[#ECFDF3] text-[#027A48]">
                        <span className="mr-5 w-5 text-right text-[#98A2B3]">
                          +
                        </span>
                        <span>let retriesUsed = 0;</span>
                      </div>

                      <div className="mt-2 flex">
                        <span className="mr-5 w-5 text-right text-[#98A2B3]">
                          11
                        </span>
                        <span>
                          if (upstreamFailed &amp;&amp; retriesUsed &lt;
                          GLOBAL_RETRY_BUDGET) {"{"}
                        </span>
                      </div>

                      <div className="flex bg-[#ECFDF3] text-[#027A48]">
                        <span className="mr-5 w-5 text-right text-[#98A2B3]">
                          +
                        </span>
                        <span className="pl-4">retriesUsed++;</span>
                      </div>

                      <div className="flex">
                        <span className="mr-5 w-5 text-right text-[#98A2B3]">
                          12
                        </span>
                        <span className="pl-4">
                          callUpstream(attempt + 1);
                        </span>
                      </div>

                      <div className="flex">
                        <span className="mr-5 w-5 text-right text-[#98A2B3]">
                          13
                        </span>
                        <span>{"}"}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Verified */}
                <section className={`${agentResult ? "" : "hidden"} py-7`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                        Verified
                      </p>

                      <h2 className="mt-2 text-[19px] font-semibold">
                        Same resilience test. Same failure scenario.
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-[#039855]">
                      <ShieldCheck size={17} />
                      Mitigation verified
                    </div>
                  </div>

                  <div
                    className="mt-6 grid gap-4"
                    style={{ gridTemplateColumns: "1fr 48px 1fr" }}
                  >
                    <div className="border border-[#FECACA] bg-white px-6 py-6">
                      <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                        Before
                      </p>

                      <p className="mt-3 text-[42px] font-semibold tracking-[-0.04em] text-[#D92D20]">
                        {agentResult
  ? `${agentResult.resilienceTest.amplification}×`
  : "—"}
                      </p>

                      <p className="text-sm text-[#667085]">
                        Request amplification
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#FFF1F0] px-2.5 py-1.5 text-xs font-medium text-[#D92D20]">
                        <XCircle size={13} />
                        Failed
                      </div>
                    </div>

                    <div className="flex items-center justify-center text-[#98A2B3]">
                      →
                    </div>

                    <div className="border border-[#A6F4C5] bg-white px-6 py-6">
                      <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                        After
                      </p>

                      <p className="mt-3 text-[42px] font-semibold tracking-[-0.04em] text-[#039855]">
                        {agentResult
  ? `${agentResult.verification.amplification}×`
  : "—"}
                      </p>

                      <p className="text-sm text-[#667085]">
                        Request amplification
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#ECFDF3] px-2.5 py-1.5 text-xs font-medium text-[#039855]">
                        <CheckCircle2 size={13} />
                        Passed
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-[#E5E7EB] pt-5">
                    <p className="text-sm font-medium text-[#344054]">
                      Your codebase has learned from GitHub&apos;s outage.
                    </p>

                    <p className="mt-1 text-sm text-[#667085]">
                      The same failure mechanism that caused real production
                      impact was reproduced, mitigated, and verified before it
                      became yours.
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-[#E5E7EB] pt-5 text-xs text-[#98A2B3]">
              <span>Incident discovery via Tavily</span>
              <span>Failure analysis and mitigation via NVIDIA Nemotron</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}