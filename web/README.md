# OutageDNA

**Learn from their outage before it becomes yours.**

OutageDNA is an AI reliability agent that learns from real-world production outages, extracts the underlying failure mechanism, checks whether your own code could fail the same way, reproduces the vulnerability, recommends a mitigation, and verifies the fix.

For the Nebius × NVIDIA Global AI Hackathon 2026, OutageDNA analyzes GitHub's August 17, 2026 outage and identifies retry-storm amplification as a reusable failure pattern.

The live demo then:

1. Discovers the real incident using Tavily
2. Extracts Failure DNA using NVIDIA Nemotron through Nebius Token Factory
3. Matches that failure mechanism against vulnerable TypeScript code
4. Reproduces the issue: **100 initial requests → 900 upstream requests → 9× amplification**
5. Generates a retry-budget mitigation
6. Re-runs the same failure scenario
7. Verifies the mitigation: **300 upstream requests → 3× amplification → PASS**

**Live demo:** https://outage-dna.vercel.app

## How it works

OutageDNA follows a six-stage reliability workflow:

**Incident → Failure DNA → Exposure → Resilience Test → Mitigation → Verified**

### 1. Incident
Tavily searches for a real public production incident and retrieves the official post-incident source.

### 2. Failure DNA
NVIDIA Nemotron analyzes the incident and extracts the reusable technical failure mechanism, including its trigger, mechanism, signals, recommended test, and recommended mitigation.

### 3. Exposure
Nemotron compares the extracted Failure DNA against application source code and returns a confidence score, exact code evidence, and a technical explanation of the risk.

### 4. Resilience Test
OutageDNA executes a real failure simulation against the vulnerable code.

For the GitHub retry-storm scenario:

- Initial requests: **100**
- Upstream requests: **900**
- Request amplification: **9×**
- Result: **FAIL**

### 5. Mitigation
Nemotron recommends a concrete code-level mitigation based on the real incident and failed test.

For this demo, it recommends a global retry budget that prevents uncontrolled retry amplification.

### 6. Verified
The same failure scenario is executed against the mitigated implementation.

- Initial requests: **100**
- Upstream requests: **300**
- Request amplification: **3×**
- Result: **PASS**

## Architecture

OutageDNA is built as a multi-stage reliability agent rather than a single prompt wrapper.

```text
Real-world outage
       ↓
Tavily live search
       ↓
Official incident source
       ↓
NVIDIA Nemotron via Nebius
       ↓
Failure DNA extraction
       ↓
Source-code exposure analysis
       ↓
Executable resilience test
       ↓
Nemotron mitigation reasoning
       ↓
Same-scenario verification
       ↓
Verified resilience result
```

## Sponsor Technology

### NVIDIA Nemotron

OutageDNA uses **NVIDIA Nemotron 3 Super 120B A12B** as its reasoning model.

Nemotron is responsible for:

- extracting reusable Failure DNA from the incident report
- comparing that failure mechanism against source code
- identifying exact code evidence
- producing the exposure confidence and technical explanation
- reasoning about an incident-specific mitigation

Model:

```text
nvidia/nemotron-3-super-120b-a12b
```

### Nebius Token Factory

NVIDIA Nemotron is accessed through **Nebius Token Factory** using its OpenAI-compatible API.

The application keeps the Nebius API key server-side and calls Nemotron from the Next.js API route.

### Tavily

OutageDNA uses **Tavily** for live incident discovery.

For the current demonstration, Tavily searches for GitHub's August 17, 2026 outage and prioritizes the official `github.blog` post-incident report before passing the incident content to Nemotron.

### Next.js + TypeScript

The judge-facing application is built with **Next.js, React, TypeScript, and Tailwind CSS** and deployed on Vercel.

The resilience simulations are executable TypeScript rather than pre-written result text. The vulnerable implementation produces **9× request amplification**, while the controlled mitigated implementation produces **3× amplification** under the same scenario.

> **Implementation note:** Nemotron generates the mitigation reasoning used by the web agent. The web demo verifies that strategy against a controlled patched implementation of the same retry-storm scenario, keeping the before/after comparison deterministic and reproducible.

## Run locally

### Prerequisites

- Node.js 20+
- npm
- Nebius Token Factory API key
- Tavily API key

### 1. Clone the repository

```bash
git clone https://github.com/hoykay/outage-dna.git
cd outage-dna/web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env.local` file inside `web/`:

```env
NEBIUS_API_KEY=your_nebius_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Do not commit this file. It is ignored by Git.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Run the production build

```bash
npm run build
```

## Main demo route

The primary judge-facing investigation is:

```text
/incidents/github-aug-17-2026
```

From that page, click **Run resilience test** to execute the live OutageDNA workflow.

## Current limitations

OutageDNA is currently a focused hackathon prototype built around one deeply verified failure class: retry-storm amplification.

The current version:

- analyzes one primary real-world incident in the judge-facing demo
- scans a controlled TypeScript sample rather than an arbitrary connected production repository
- uses a deterministic patched implementation for web verification after Nemotron generates the mitigation strategy
- does not yet automatically open pull requests or modify a user's production repository
- focuses on reliability reasoning and verification rather than full CI/CD integration

These constraints keep the demonstration reproducible while proving the core idea: real production failures can become reusable preventive intelligence for other software systems.

## What comes next

A production version of OutageDNA could:

- continuously ingest new public outage reports
- build a growing library of reusable Failure DNA patterns
- connect directly to GitHub repositories
- scan multiple services and languages
- generate temporary resilience tests in isolated sandboxes
- propose patches as pull requests
- run verification in CI before a change is accepted
- learn which mitigations successfully prevent recurring failure classes

The long-term goal is to create a form of **collective memory for software reliability**.

## Nebius + NVIDIA feedback

Nebius Token Factory made it straightforward to integrate NVIDIA Nemotron into an existing TypeScript application through an OpenAI-compatible API.

For OutageDNA, the most valuable capability was using Nemotron for structured technical reasoning across multiple stages rather than a single chat interaction: incident analysis, failure-pattern extraction, source-code comparison, and mitigation reasoning.

The combination of Nebius infrastructure and NVIDIA Nemotron allowed the application to turn unstructured post-incident reporting into structured, executable reliability intelligence.

## Tavily feedback

Tavily gave OutageDNA a live connection to real-world incident information instead of relying on a hard-coded outage description.

That matters for the product concept because OutageDNA is designed to continuously learn from failures happening across the software ecosystem. Tavily provides the discovery layer that can feed those incidents into the reliability agent.

## License

This project is released under the **MIT License**.