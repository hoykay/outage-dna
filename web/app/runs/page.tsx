import {
  Activity,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  History,
  MoreHorizontal,
  Search,
} from "lucide-react";

export default function RunsPage() {
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
                className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-[#667085] hover:bg-[#F7F8FA] hover:text-[#111318]"
              >
                <Search size={17} strokeWidth={1.8} />
                Incidents
              </a>

              <a
                href="/runs"
                className="flex h-10 items-center gap-3 rounded-md bg-[#EEF2FF] px-3 text-sm font-medium text-[#3157D5]"
              >
                <History size={17} strokeWidth={1.8} />
                Runs
              </a>
            </div>
          </nav>

          <div className="border-t border-[#E5E7EB] px-4 py-5">
            <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">
              Connected
            </p>

            <div className="flex items-center gap-3 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white">
                <GitBranch size={16} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-sm font-medium text-[#344054]">GitHub</p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#12B76A]" />
                  <span className="text-xs text-[#98A2B3]">Connected</span>
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
                <h1 className="text-[30px] font-semibold tracking-[-0.03em]">
                  Analysis runs
                </h1>

                <p className="mt-2 text-[14px] leading-6 text-[#667085]">
                  History of resilience analyses performed on your codebase.
                </p>
              </div>

              <a
                href="/incidents"
                className="flex h-10 items-center gap-2 rounded-md bg-[#3157D5] px-4 text-sm font-medium text-white transition hover:bg-[#2949B8]"
              >
                New analysis
                <ArrowRight size={15} strokeWidth={2} />
              </a>
            </div>

            {/* Summary */}
            <div
              className="mt-9 grid border-y border-[#E5E7EB] bg-white"
              style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
            >
              <div className="border-r border-[#E5E7EB] px-6 py-5">
                <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                  Analyses completed
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                  1
                </p>
              </div>

              <div className="border-r border-[#E5E7EB] px-6 py-5">
                <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                  Failure patterns found
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                  1
                </p>
              </div>

              <div className="px-6 py-5">
                <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                  Verified mitigations
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <p className="text-2xl font-semibold tracking-[-0.03em]">
                    1
                  </p>

                  <CheckCircle2
                    size={17}
                    strokeWidth={2}
                    className="text-[#039855]"
                  />
                </div>
              </div>
            </div>

            {/* Runs table */}
            <section className="mt-10">
              <div className="mb-4">
                <h2 className="text-[16px] font-semibold">
                  Run history
                </h2>
              </div>

              <div className="overflow-hidden bg-white">
                <div
                  className="grid border-b border-[#E5E7EB] bg-[#FAFAFA] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]"
                  style={{
                    gridTemplateColumns:
                      "0.6fr 1.7fr 1fr 0.8fr 0.7fr 0.7fr 0.9fr 0.7fr 32px",
                  }}
                >
                  <span>Run</span>
                  <span>Incident</span>
                  <span>Date</span>
                  <span>Match</span>
                  <span>Before</span>
                  <span>After</span>
                  <span>Status</span>
                  <span>Action</span>
                  <span />
                </div>

                <div
                  className="grid items-center border-b border-[#E5E7EB] px-5 py-5"
                  style={{
                    gridTemplateColumns:
                      "0.6fr 1.7fr 1fr 0.8fr 0.7fr 0.7fr 0.9fr 0.7fr 32px",
                  }}
                >
                  <span className="font-mono text-xs text-[#667085]">
                    #001
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E5E7EB] bg-[#FAFAFA]">
                      <GitBranch size={16} strokeWidth={1.8} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#344054]">
                        GitHub
                      </p>

                      <p className="mt-0.5 text-xs text-[#98A2B3]">
                        Aug 17, 2026 outage
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#667085]">
                      Oct 28, 2026
                    </p>

                    <p className="mt-0.5 text-xs text-[#98A2B3]">
                      14:32
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-[#344054]">
                    95%
                  </span>

                  <span className="text-sm font-semibold text-[#D92D20]">
                    9×
                  </span>

                  <span className="text-sm font-semibold text-[#039855]">
                    3×
                  </span>

                  <div className="flex">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#ECFDF3] px-2 py-1 text-xs font-medium text-[#039855]">
                      <CheckCircle2 size={13} />
                      Verified
                    </span>
                  </div>

                  <a
                    href="/incidents/github-aug-17-2026"
                    className="text-sm font-medium text-[#3157D5]"
                  >
                    View
                  </a>

                  <button className="text-[#98A2B3]">
                    <MoreHorizontal size={17} />
                  </button>
                </div>
              </div>
            </section>

            {/* Run detail */}
            <section className="mt-10 border-t border-[#E5E7EB] pt-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#98A2B3]">
                    Latest verified run
                  </p>

                  <h2 className="mt-2 text-[19px] font-semibold">
                    GitHub retry-storm analysis
                  </h2>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#ECFDF3] px-2.5 py-1.5 text-xs font-medium text-[#039855]">
                  <CheckCircle2 size={13} />
                  Mitigation verified
                </span>
              </div>

              <div
                className="mt-6 grid gap-4"
                style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
              >
                <div className="border border-[#E5E7EB] bg-white px-5 py-5">
                  <p className="text-xs text-[#98A2B3]">
                    Failure pattern
                  </p>

                  <p className="mt-2 text-base font-semibold">
                    Retry storm
                  </p>
                </div>

                <div className="border border-[#E5E7EB] bg-white px-5 py-5">
                  <p className="text-xs text-[#98A2B3]">
                    Match confidence
                  </p>

                  <p className="mt-2 text-base font-semibold">
                    95%
                  </p>
                </div>

                <div className="border border-[#FECACA] bg-white px-5 py-5">
                  <p className="text-xs text-[#98A2B3]">
                    Before
                  </p>

                  <p className="mt-2 text-base font-semibold text-[#D92D20]">
                    9× amplification
                  </p>
                </div>

                <div className="border border-[#A6F4C5] bg-white px-5 py-5">
                  <p className="text-xs text-[#98A2B3]">
                    After
                  </p>

                  <p className="mt-2 text-base font-semibold text-[#039855]">
                    3× amplification
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-y border-[#E5E7EB] bg-white px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-[#344054]">
                    Same resilience test passed after mitigation
                  </p>

                  <p className="mt-1 text-xs text-[#98A2B3]">
                    Source incident discovered via Tavily · Failure analysis and
                    mitigation generated with NVIDIA Nemotron
                  </p>
                </div>

                <a
                  href="/incidents/github-aug-17-2026"
                  className="flex items-center gap-2 text-sm font-medium text-[#3157D5]"
                >
                  Open investigation
                  <ArrowRight size={14} />
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}