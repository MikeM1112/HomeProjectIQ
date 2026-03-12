# HomeProjectIQ AI System Design

## Overview

This document defines the artificial intelligence architecture for HomeProjectIQ.

The AI layer powers the core intelligence of the platform, enabling the system to:

- Diagnose home repair issues from images and user descriptions
- Guide users step-by-step through repairs
- Determine whether DIY or professional repair is the best option
- Evaluate tool readiness and social tool availability
- Predict future home system failures
- Calculate a Home Capability Score for the household

The goal is not to build a single monolithic AI. Instead, HomeProjectIQ uses **multiple specialized AI engines** orchestrated together.

---

# AI Architecture Overview

The intelligence layer is composed of several engines:
AI Intelligence Layer
│
├── Diagnostic AI Engine
├── Guided Repair AI Engine
├── Toolbox Intelligence Engine
├── DIY Decision Engine
├── Home Capability Score Engine
├── Home Risk Radar Engine
└── Social Trust Engine

Each engine performs a focused task and outputs structured data used by the rest of the platform.

---

# 1. Diagnostic AI Engine

## Purpose

Identify home issues from photos and contextual information.

This is the entry point for most user interactions.

---

## Inputs

Diagnostic requests may include:

- Image(s) of the issue
- Short video clip
- User text description
- Property metadata
- Zone or room context
- System metadata (HVAC, plumbing, electrical, etc.)
- Prior diagnostic history

Example input:
{
"zone": "kitchen",
"system_hint": "plumbing",
"user_description": "water leaking under faucet",
"images": ["img_001", "img_002"],
"property_year_built": 2004
}

---

## Pipeline

The diagnostic pipeline operates in stages.

### Step 1: Image preprocessing

- Normalize image resolution
- Enhance lighting if necessary
- Extract regions of interest

---

### Step 2: Visual feature extraction

Computer vision identifies:

- materials
- objects
- components
- defects

Example observations:
water stain
corrosion
cracked seal
loose pipe connection
mold-like growth

---

### Step 3: Issue classification

Observed features are matched against a repair knowledge base.

Example classification candidates:
Faucet cartridge leak
Drain trap leak
Supply line leak
Loose valve connection

---

### Step 4: Confidence ranking

Diagnoses are ranked based on probability.

Example output:
Primary diagnosis: Faucet cartridge leak Confidence: 0.89
Alternate diagnoses: Drain trap leak – 0.47 Loose valve seal – 0.32

---

### Step 5: Enrichment

The diagnosis is enriched with structured repair knowledge:

- severity
- urgency
- DIY suitability
- required tools
- materials
- estimated time
- cost ranges
- risk if ignored

---

## Output

Example structured output:
{
"issue_code": "PLUMBING_FAUCET_CARTRIDGE_LEAK",
"confidence": 0.89,
"severity": "medium",
"urgency": "fix_within_7_days",
"risk_if_ignored": "cabinet water damage",
"diy_possible": true,
"required_tools": [
"adjustable_wrench",
"allen_key",
"screwdriver"
],
"estimated_time_minutes": 45,
"estimated_diy_cost": [25, 60],
"estimated_pro_cost": [150, 280]
}

---

# 2. Guided Repair AI Engine

## Purpose

Provide GPS-style repair guidance throughout the project.

Instead of one-time instructions, this engine validates user progress through photo checkpoints.

---

## Guided Repair Workflow
Diagnosis created → Project created → Guided repair session started → Step-by-step instructions → User uploads checkpoint photo → AI validates step → AI approves, corrects, or reroutes

---

## Inputs

- Diagnosis
- Current project step
- Expected visual state
- User checkpoint image
- Prior project context

---

## Validation Process

### Step comparison

The AI compares the checkpoint image against the expected repair state.

Possible outcomes:
STEP_COMPLETE
STEP_INCOMPLETE
STEP_INCORRECT
UNEXPECTED_CONDITION
SAFETY_WARNING

---

## Output

Example feedback:
Step status: incomplete
Feedback: The retaining clip is still partially seated.
Recommended action: Remove clip fully before continuing.

---

## Rerouting Logic

If the situation differs from the original diagnosis:
Possible corrosion detected.
Repair difficulty increased.
Recommendation: Use penetrating oil or consider professional service.

---

# 3. Toolbox Intelligence Engine

## Purpose

Determine whether the user has the necessary tools to complete a repair.

---

## Inputs

- Required tools
- User-owned tools
- Borrowable tools from network
- Tool substitutes

---

## Evaluation Logic

Tool readiness levels:
FULLY_READY
PARTIALLY_READY
NOT_READY

---

## Output Example
Required tools: adjustable wrench allen key screwdriver
Owned tools: screwdriver
Borrowable tools: adjustable wrench (Alex)
Missing tools: allen key ($9)

---

# 4. DIY Decision Engine

## Purpose

Determine whether DIY repair is worth it.

---

## Inputs

- Diagnosis difficulty
- Tool readiness
- User handy level
- Material costs
- Tool purchase costs
- User time value
- Professional service cost

---

## Decision Model

Total DIY cost:
DIY cost = materials + tool cost + time cost

Time cost:
time_cost = hours_required × user_hourly_value

---

## Output Example
DIY total cost: $58 Pro repair cost: $180
Recommendation: DIY Estimated savings: $122

---

# 5. Home Capability Score Engine

## Purpose

Measure household readiness for repairs.

---

## Inputs

- Tool inventory
- Completed repairs
- Maintenance history
- Documented systems
- Emergency preparedness
- Social tool network

---

## Score Range
0–100 scale

---

## Score Factors

| Factor | Weight |
|------|------|
Tool readiness | 25%
Repair experience | 25%
System documentation | 20%
Maintenance discipline | 20%
Emergency preparedness | 10%

---

## Example Output
Home Capability Score: 78
Tool readiness: 20/25 Repair experience: 18/25 System knowledge: 12/20 Maintenance discipline: 16/20 Emergency readiness: 12/10

---

# 6. Home Risk Radar Engine

## Purpose

Predict system failures before they occur.

---

## Inputs

- System age
- Maintenance history
- Diagnostic findings
- Environmental factors
- Inspection data

---

## Risk Model

Example risk factors:
risk = system_age_score
+ maintenance_penalty
+ environment_multiplier
+ issue_history_penalty

---

## Output Example
Water heater risk: HIGH Reason: unit age 11 years
HVAC risk: MODERATE Reason: maintenance overdue
Roof risk: LOW

---

# 7. Social Trust Engine

## Purpose

Support safe tool lending.

---

## Inputs

- tool loans
- return timeliness
- ratings
- usage frequency

---

## Trust Metrics

Example:
Lender reliability score
Borrower reliability score
Tool lending frequency
On-time return percentage

---

# AI Data Feedback Loop

As the platform grows, the system improves.
User scans issue
→ diagnosis recorded
→ repair path chosen
→ repair outcome logged
→ AI learns from success/failure
→ models improve

Over time the platform builds a large dataset of:

- issue patterns
- repair outcomes
- cost ranges
- tool usage
- failure timelines

---

# AI Safety and Trust Principles

The system should always prioritize safety.

AI must be able to say:
Confidence low
This may require professional inspection
Safety risk detected
Stop repair and consult professional

Transparency builds long-term trust.

---

# AI System Principles

1. AI outputs must always be **structured data**.

2. AI recommendations must always include **reasoning**.

3. AI should support workflows rather than replace them.

4. AI confidence levels must always be visible.

5. Users should be able to override AI decisions.

---

# Future AI Enhancements

Future intelligence improvements may include:

- Predictive failure models
- Neighborhood repair trend analysis
- Insurance claim prediction
- Automatic system identification via walkthrough scans
- AI-generated repair cost forecasting

---

# Conclusion

The AI layer transforms HomeProjectIQ from a simple repair tool into a **home intelligence platform**.

By combining diagnostics, repair guidance, tool readiness, and predictive system monitoring, the platform empowers homeowners to make smarter decisions and maintain their homes proactively.

The architecture ensures that each AI engine operates independently but contributes to a unified home intelligence system.
