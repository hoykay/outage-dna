import {
  Activity,
  ChevronRight,
  ExternalLink,
  GitBranch,
  History,
  Search,
} from "lucide-react";

const columns =
  "1.5fr 0.9fr 0.8fr 1.2fr 1.2fr 1fr 0.8fr 40px";

export default function IncidentsPage() {
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
          <div className="mx-auto max-w-[1180px] px-10 py-10">
            <div>
              <h1 className="text-[30px] font-semibold tracking-[-0.03em]">
                Real-world incidents
              </h1>

              <p className="mt-2 text-[14px] leading-6 text-[#667085]">
                Official post-incident reports converted into actionable
                engineering intelligence for your codebase.
              </p>
            </div>

            {/* Filters */}
            <div className="mt-8 flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <p className="text-sm text-[#667085]">
                1 live incident · 2 examples
              </p>

              <div className="flex gap-2">
                <button className="rounded-md border border-[#D0D5DD] bg-white px-3 py-2 text-sm font-medium text-[#344054]">
                  All providers
                </button>

                <button className="rounded-md border border-[#D0D5DD] bg-white px-3 py-2 text-sm font-medium text-[#344054]">
                  All failure patterns
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden bg-white">
              {/* Header */}
              <div
                className="grid border-b border-[#E5E7EB] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.04em] text-[#98A2B3]"
                style={{ gridTemplateColumns: columns }}
              >
                <span>Incident</span>
                <span>Date</span>
                <span>Duration</span>
                <span>Failure pattern</span>
                <span>Impact</span>
                <span>Source</span>
                <span>Status</span>
                <span />
              </div>

              {/* GitHub */}
              <a
                href="/incidents/github-aug-17-2026"
                className="grid items-center border-b border-[#E5E7EB] px-5 py-5 transition hover:bg-[#FAFAFA]"
                style={{ gridTemplateColumns: columns }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E5E7EB] bg-[#FAFAFA]">
                    <GitBranch size={17} strokeWidth={1.8} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#344054]">
                      GitHub
                    </p>
                    <p className="mt-0.5 text-xs text-[#98A2B3]">
                      Production outage
                    </p>
                  </div>
                </div>

                <span className="text-sm text-[#667085]">Aug 17, 2026</span>

                <span className="text-sm text-[#667085]">7h 47m</span>

                <div>
                  <span className="rounded-full bg-[#FFF1F0] px-2 py-1 text-xs font-medium text-[#D92D20]">
                    Retry storm
                  </span>
                </div>

                <span className="text-sm text-[#667085]">
                  Multiple services
                </span>

                <div className="flex items-center gap-1 text-sm font-medium text-[#3157D5]">
                  github.blog
                  <ExternalLink size={12} />
                </div>

                <div>
                  <span className="rounded-md bg-[#EEF2FF] px-2 py-1 text-xs font-medium text-[#3157D5]">
                    Live
                  </span>
                </div>

                <ChevronRight size={16} className="text-[#98A2B3]" />
              </a>

              {/* AWS */}
              <div
                className="grid items-center border-b border-[#E5E7EB] px-5 py-5"
                style={{ gridTemplateColumns: columns }}
              >
                <div>
                  <p className="text-sm font-semibold text-[#344054]">AWS</p>
                  <p className="mt-0.5 text-xs text-[#98A2B3]">
                    Example incident
                  </p>
                </div>

                <span className="text-sm text-[#667085]">Jun 12, 2023</span>

                <span className="text-sm text-[#667085]">3h 12m</span>

                <span className="text-sm text-[#667085]">
                  Configuration error
                </span>

                <span className="text-sm text-[#667085]">
                  US-EAST-1 services
                </span>

                <span className="text-sm text-[#98A2B3]">
                  aws.amazon.com
                </span>

                <div>
                  <span className="rounded-md bg-[#F2F4F7] px-2 py-1 text-xs font-medium text-[#667085]">
                    Example
                  </span>
                </div>

                <span />
              </div>

              {/* Cloudflare */}
              <div
                className="grid items-center px-5 py-5"
                style={{ gridTemplateColumns: columns }}
              >
                <div>
                  <p className="text-sm font-semibold text-[#344054]">
                    Cloudflare
                  </p>
                  <p className="mt-0.5 text-xs text-[#98A2B3]">
                    Example incident
                  </p>
                </div>

                <span className="text-sm text-[#667085]">Nov 18, 2022</span>

                <span className="text-sm text-[#667085]">2h 39m</span>

                <span className="text-sm text-[#667085]">
                  Dependency failure
                </span>

                <span className="text-sm text-[#667085]">
                  Global services
                </span>

                <span className="text-sm text-[#98A2B3]">
                  blog.cloudflare.com
                </span>

                <div>
                  <span className="rounded-md bg-[#F2F4F7] px-2 py-1 text-xs font-medium text-[#667085]">
                    Example
                  </span>
                </div>

                <span />
              </div>
            </div>

            <div className="mt-6 border-t border-[#E5E7EB] pt-5 text-xs leading-5 text-[#98A2B3]">
              GitHub is the live OutageDNA demo incident. Additional incidents
              are interface examples and are not part of the current analysis.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}