---
title: "Voice Triage PWA"
blurb: "Multilingual voice-first health triage app built on AWS — speak your symptoms, get directed to the nearest clinic."
period: "Aug 2026"
order: 5
featured: false
role: "Backend Architect & Infrastructure Lead"
domain: software
stack:
  - "AWS CDK"
  - "Node.js"
  - "Amazon Bedrock (Claude Sonnet)"
  - "AWS Lambda"
  - "API Gateway"
  - "DynamoDB"
  - "Amazon Polly"
  - "Amazon Transcribe"
  - "Amazon Translate"
  - "Amazon Location Service"
  - "React (Vite + TypeScript)"
  - "S3 + CloudFront"
keyResult: "Full simulated patient load ran at under $2 in total compute cost; voice-to-response latency under 4 seconds on a mobile device"
hero: ../../assets/placeholders/hero-16x9.svg
heroAlt: "Phone screen showing a hold-to-speak button and a clinic recommendation card with urgency level and nearest public health centre"
---

## PROBLEM

South Africa has over 4,000 public clinics, but patients — particularly those
managing HIV and TB — routinely skip care because they don't know which clinic
to go to, how long the queue is, or whether they qualify for free treatment
programmes. Language is an additional barrier: most digital health tools assume
English literacy. The result is missed doses, late diagnoses, and preventable
deterioration.

## CONSTRAINTS

- **Hackathon time-box:** Standard Bank UniHack 2026 — working demo required
  within the event window.
- **Device target:** Low-end Android on a mobile data bundle; no assumption of
  desktop or fast Wi-Fi.
- **Latency:** Full voice-to-spoken-response loop had to feel responsive on a
  live demo — target under 5 seconds end-to-end.
- **Cost:** Free-tier and minimal-spend AWS services only; the demo had to be
  provably cheap to run at scale.
- **No PII:** Condition stored as an enum (e.g. `CHRONIC_HIV`, `TB_RISK`),
  never free text; DynamoDB sessions keyed by anonymous PIN with 24-hour TTL.

## WHAT I BUILT

Architected the entire serverless backend using AWS CDK, provisioning three
Lambda functions (triage, clinic search, session management), a DynamoDB table
with TTL-based anonymous sessions, an API Gateway REST API with CORS, and an
S3 + CloudFront distribution for the React PWA.

The core triage flow: user speaks into the browser → browser speech recognition
converts audio to text → `umnyango-triage` Lambda calls Amazon Bedrock (Claude
Sonnet) with a structured JSON system prompt → Bedrock returns urgency level,
recommended clinic type, and applicable free SA health programmes → Amazon Polly
synthesises the summary as audio → base64-encoded MP3 is returned to the
frontend and played back.

Amazon Location Service was integrated for nearest-clinic queries seeded with
Department of Health open facility data. Amazon Translate and Transcribe were
scoped into the architecture for multilingual support beyond the browser's
native speech API.

## RESULT

- Full simulated patient load cost under $2 in total AWS compute.
- Voice-to-spoken-response latency measured under 4 seconds on a real mobile
  device over a standard data connection.
- Live demo completed successfully on a phone in front of judges — no
  pre-recorded fallback needed.

## WHAT I'D DO DIFFERENTLY

The browser's `webkitSpeechRecognition` API was used as a shortcut for
speech-to-text during the hackathon rather than Amazon Transcribe. This worked
for the demo but is not production-viable — it has inconsistent support across
Android browsers and no programmatic language detection. Transcribe would give
proper multilingual control and eliminate the browser dependency.

I'd also seed the clinic database from the DHIS2 API programmatically rather
than a static JSON file, and add a CloudWatch dashboard from day one — debugging
Lambda cold starts without metrics cost more time than it should have.co