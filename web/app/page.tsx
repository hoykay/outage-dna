import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  GitBranch,
  History,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#111318]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-[#E5E7EB] bg-white">
          <div className="flex h-16 items-center border-b border-[#E5E7EB] px-6">
            <div className="text-[19px] font-semibold tracking-[-0.02em]">
              <span className="text-[#111318]">Outage</span>
              <span className="text-[#3157D5]">DNA</span>
            </div>
          </div>

          <nav className="flex-1 px-3 py-5">
            <div className="space-y-1">
              <a
                href="#"
                className="flex h-10 items-center gap-3 rounded-md bg-[#EEF2FF] px-3 text-sm font-medium text-[#3157D5]"
              >
                <Activity size={17} strokeWidth={1.8} />
                Overview
              </a>

              <a
                href="/incidents"
                className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-[#667085] transition hover:bg-[#F7F8FA] hover:text-[#111318]"
              >
                <Search size={17} strokeWidth={1.8} />
                Incidents
              </a>

              <a
                href="/runs"
                className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-[#667085] transition hover:bg-[#F7F8FA] hover:text-[#111318]"
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
          <div className="mx-auto max-w-[1180px] px-10 py-10">
            {/* Header */}
            <div className="flex items-start justify-between gap-8">
              <div>
                <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-[#111318]">
                  Overview
                </h1>
                <p className="mt-2 text-[14px] leading-6 text-[#667085]">
                  Learn from real-world outages before the same failure reaches
                  your codebase.
                </p>
              </div>

              <a
  href="/incidents/github-aug-17-2026"
  className="flex h-10 items-center gap-2 rounded-md bg-[#3157D5] px-4 text-sm font-medium text-white transition hover:bg-[#2949B8]"
>
  Open live investigation
  <ArrowRight size={15} strokeWidth={2} />
</a>
            </div>

            {/* Latest incident */}
            <section className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#111318]">
                  Latest incident
                </h2>

                <a
  href="/incidents"
  className="text-sm font-medium text-[#3157D5]"
>
  View all incidents
</a>
              </div>

              <div className="border-y border-[#E5E7EB] bg-white">
                <div className="flex items-start justify-between gap-8 px-6 py-6">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#E5E7EB] bg-[#FAFAFA]">
                      <GitBranch size={19} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[16px] font-semibold text-[#111318]">
                          GitHub — August 17, 2026
                        </h3>

                        <span className="rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-2 py-0.5 text-[11px] font-medium text-[#667085]">
                          Official post-incident report
                        </span>
                      </div>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                        Client retry behavior amplified traffic during service
                        recovery, contributing to cascading load and prolonged
                        disruption.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#667085]">
                        <span>
                          <strong className="font-medium text-[#344054]">
                            Duration
                          </strong>{" "}
                          · 7h 47m
                        </span>
                        <span>
                          <strong className="font-medium text-[#344054]">
                            Failure pattern
                          </strong>{" "}
                          · Retry storm
                        </span>
                        <span>
                          <strong className="font-medium text-[#344054]">
                            Source
                          </strong>{" "}
                          · github.blog
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
  href="/incidents/github-aug-17-2026"
  className="shrink-0 rounded-md border border-[#D0D5DD] bg-white px-3.5 py-2 text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
>
  Investigate
</a>
                </div>
              </div>
            </section>

            {/* Current state */}
            <section className="mt-10">
              <h2 className="text-[16px] font-semibold text-[#111318]">
                Verified demo result
              </h2>

              <div className="mt-4 grid grid-cols-3 border-y border-[#E5E7EB] bg-white">
                <div className="border-r border-[#E5E7EB] px-6 py-6">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-[#FFF1F0] text-[#D92D20]">
                    <CircleDot size={17} strokeWidth={2} />
                  </div>

                  <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                    Open exposure
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                    Retry storm
                  </p>
                  <p className="mt-1 text-sm text-[#667085]">
                    95% mechanism match
                  </p>
                </div>

                <div className="border-r border-[#E5E7EB] px-6 py-6">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-[#FFF1F0] text-[#D92D20]">
                    <Activity size={17} strokeWidth={2} />
                  </div>

                  <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                    Before mitigation
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-semibold tracking-[-0.03em]">
                      9×
                    </p>
                    <span className="text-xs font-medium text-[#D92D20]">
                      Failed
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#667085]">
                    Request amplification
                  </p>
                </div>

                <div className="px-6 py-6">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-[#ECFDF3] text-[#039855]">
                    <ShieldCheck size={17} strokeWidth={2} />
                  </div>

                  <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                    After mitigation
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-semibold tracking-[-0.03em]">
                      3×
                    </p>
                    <span className="text-xs font-medium text-[#039855]">
                      Verified
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#667085]">
                    Same resilience test passed
                  </p>
                </div>
              </div>
            </section>

            {/* Recent run */}
            <section className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#111318]">
                  Recent run
                </h2>

                <a
  href="/runs"
  className="text-sm font-medium text-[#3157D5]"
>
  View verified run
</a>
              </div>

              <div className="overflow-hidden border-y border-[#E5E7EB] bg-white">
                <div className="grid grid-cols-[1.6fr_1fr_0.7fr_0.7fr_0.8fr] border-b border-[#E5E7EB] bg-[#FAFAFA] px-6 py-3 text-xs font-medium text-[#667085]">
                  <span>Incident</span>
                  <span>Failure pattern</span>
                  <span>Before</span>
                  <span>After</span>
                  <span>Status</span>
                </div>

                <div className="grid grid-cols-[1.6fr_1fr_0.7fr_0.7fr_0.8fr] items-center px-6 py-4 text-sm">
                  <div>
                    <p className="font-medium text-[#344054]">
                      GitHub · Aug 17, 2026
                    </p>
                    <p className="mt-0.5 text-xs text-[#98A2B3]">
                      retryStormVulnerable.ts
                    </p>
                  </div>

                  <span className="text-[#667085]">Retry storm</span>

                  <span className="font-medium text-[#D92D20]">9×</span>

                  <span className="font-medium text-[#039855]">3×</span>

                  <div className="flex items-center gap-1.5 text-[#039855]">
                    <CheckCircle2 size={15} strokeWidth={2} />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-[#E5E7EB] pt-5 text-xs text-[#98A2B3]">
              <span>Incident discovery via Tavily</span>
              <span>Failure analysis via NVIDIA Nemotron</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}