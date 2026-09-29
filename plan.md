Build a production-ready Wix App.

# Project Name

Forms PDF & Signature Export

# Core Purpose

Create a Wix App that allows site owners to generate clean, professional, downloadable PDF documents from native Wix Forms submissions.

The app must improve how Wix Form submissions are turned into readable records.

Core requirements:

- Drawn signatures must appear as the actual signature image inside the PDF.
- Uploaded images must appear visually alongside the submitted answers.
- Other uploaded file types should be listed clearly with filename and available metadata.
- Site owners must be able to browse historical submissions.
- Site owners must be able to preview and generate PDFs for any submission.
- New submissions must be processed using Wix events rather than polling.
- Automatic PDF generation must work even when the dashboard is closed.
- PDFs must support branding and customization.
- The app must be reliable enough for Wix App Market distribution.

The app should primarily be a Wix Dashboard app.

A site widget is not required for V1 unless a verified Wix capability requires one.

---

# Dashboard UI Requirement

Use `shadcn/ui` for the entire dashboard interface.

Do not mix the dashboard with another component library.

Use shadcn/ui consistently for:

- Cards
- Tables
- Buttons
- Inputs
- Selects
- Dropdown menus
- Dialogs
- Sheets
- Tabs
- Tooltips
- Popovers
- Command menus
- Badges
- Alerts
- Progress indicators
- Skeletons
- Checkboxes
- Radio groups
- Switches
- Forms
- Pagination controls
- Breadcrumbs
- Collapsible sections
- Navigation
- Toast-compatible actions

Use Lucide icons where icons are required.

The dashboard should have a clean, modern SaaS appearance.

Avoid excessive gradients.

Use consistent spacing, typography, hierarchy, border radius, and component behavior throughout the app.

---

# Dashboard Layout

Use a modern dashboard shell with:

- Collapsible left sidebar
- Top header
- Breadcrumbs
- Page title
- Contextual actions
- Responsive content area
- User/site context where appropriate
- Help/support entry
- Billing/plan status
- Mobile/tablet responsive navigation

Suggested navigation:

```text id="ywu3jw"
Overview
Forms
Submissions
PDF Templates
Automations
Automation Logs
Settings
Billing
Help
```

Use shadcn components throughout the sidebar and dashboard.

---

# Dashboard Onboarding Checklist

The Overview dashboard must include a prominent onboarding checklist for new users.

The checklist should explain what the site owner needs to do before the app is fully ready.

Display it near the top of the Overview page until the important setup steps are completed.

Suggested title:

```text id="ug7v4g"
Get Started
```

Suggested subtitle:

```text id="tswmmt"
Complete these steps to start generating PDFs from your Wix Form submissions.
```

The checklist should contain actionable setup steps.

Recommended checklist:

```text id="y0wkza"
1. Verify Wix Forms
2. Select a form
3. Choose or create a PDF template
4. Configure how submissions appear in PDFs
5. Generate a test PDF
6. Enable automatic PDF generation
7. Configure delivery options
```

Each step should have:

- Title
- Short description
- Completion state
- Action button
- Optional help tooltip
- Completed icon
- Incomplete icon

Use shadcn Cards, Progress, Checkboxes, Buttons, Badges, and Collapsible components as appropriate.

---

# Checklist Step 1 — Verify Wix Forms

Title:

```text id="kp8pdl"
Verify Wix Forms
```

Description:

```text id="8nwgv7"
Confirm that Wix Forms is installed and accessible on this site.
```

Status behavior:

If Wix Forms is available:

```text id="92b5h8"
Completed
```

If it is unavailable:

```text id="usulbu"
Action Required
```

Action:

```text id="3g0xhn"
Check Wix Forms
```

The app should automatically complete this step when Wix Forms is confirmed.

---

# Checklist Step 2 — Select a Form

Title:

```text id="e00exp"
Select a Form
```

Description:

```text id="xd4fxs"
Choose the Wix Form you want to use with Forms PDF.
```

Action:

```text id="xhvrz4"
Browse Forms
```

Mark the step complete when at least one form has been configured in the app.

---

# Checklist Step 3 — Choose a PDF Template

Title:

```text id="9v67o6"
Choose a PDF Template
```

Description:

```text id="j1w4hd"
Select a starter template or create your own PDF design.
```

Action:

```text id="jwxd7l"
Choose Template
```

Mark complete when the site has a default template or at least one form has an assigned template.

---

# Checklist Step 4 — Configure PDF Content

Title:

```text id="as5d5x"
Configure PDF Content
```

Description:

```text id="qzs4lf"
Choose how answers, uploaded images, signatures, headers, and footers should appear.
```

Action:

```text id="x6zcpt"
Configure PDF
```

Mark complete after the user saves PDF configuration for at least one form/template.

---

# Checklist Step 5 — Generate a Test PDF

Title:

```text id="oy9yv2"
Generate a Test PDF
```

Description:

```text id="j1egk4"
Generate a PDF from an existing submission to confirm everything looks correct.
```

Action:

```text id="g8rhwf"
Generate Test PDF
```

If there are no submissions yet, show:

```text id="v6n9ro"
Waiting for a submission
```

Do not mark the checklist as failed.

Mark it complete once a PDF has been successfully generated.

---

# Checklist Step 6 — Enable Automatic PDF Generation

Title:

```text id="io25af"
Enable Automatic PDFs
```

Description:

```text id="txo9rd"
Automatically generate a PDF whenever a new confirmed submission is received.
```

Action:

```text id="mbc0ug"
Configure Automation
```

Mark complete when at least one form has automatic PDF generation enabled.

If this is a paid feature and the current plan cannot use it, display a plan badge instead of treating it as an error.

Example:

```text id="b0g3m9"
Pro Feature
```

---

# Checklist Step 7 — Configure Delivery

Title:

```text id="xi84r6"
Configure Delivery
```

Description:

```text id="j5whnc"
Choose what happens after a PDF is generated.
```

Possible delivery actions:

- Save PDF
- Email site owner
- Email form submitter
- Send to custom recipients
- Send webhook

Action:

```text id="3w6th2"
Configure Delivery
```

Only show supported options.

Mark complete once the user has configured at least one post-generation action.

---

# Checklist Progress

Display progress at the top of the checklist.

Example:

```text id="f7q2y5"
Setup Progress

4 of 7 completed
```

Use a shadcn Progress component.

Calculate:

```text id="rcaeou"
completedSteps / totalApplicableSteps
```

If a feature does not apply to the current plan, either:

- exclude it from the required count, or
- mark it as optional

Do not make paid-only features block basic onboarding completion.

---

# Checklist Completion

When all required onboarding steps are complete, show:

```text id="iztdx7"
You're ready to go
```

Description:

```text id="m470nj"
Your Forms PDF setup is complete. New submissions can now be processed using your configured settings.
```

Actions:

```text id="gd9x44"
View Submissions
```

and:

```text id="mlbf9a"
Open Automations
```

Allow the checklist to collapse after completion.

Provide an option:

```text id="zro5b4"
Hide completed checklist
```

The user should be able to reopen it later from Help or Settings.

---

# Checklist State

Checklist completion must be based on actual app state.

Do not store simple frontend-only booleans such as:

```text id="3iq843"
step1Completed = true
```

Derive completion from real application configuration wherever possible.

Examples:

```text id="7p2wvx"
Wix Forms verified
→ Step 1 complete

At least one form configured
→ Step 2 complete

Template assigned
→ Step 3 complete

PDF settings saved
→ Step 4 complete

At least one successful PDF record
→ Step 5 complete

Automation enabled
→ Step 6 complete

Delivery action configured
→ Step 7 complete
```

This ensures checklist state remains accurate across sessions and devices.

---

# Overview Dashboard

The Overview page should include, in this order:

1. Page header
2. Plan or trial notice where relevant
3. Onboarding checklist
4. Key metrics
5. Recent submissions
6. Recent PDFs
7. Automation status
8. Failed automation alerts
9. Quick actions

Suggested metrics:

```text id="7w8au1"
Forms
Submissions
PDFs Generated
PDFs This Month
Automations Active
Failed Automations
```

Use shadcn Card components.

---

# Quick Actions

Add a shadcn Card for quick actions.

Actions:

```text id="dx0kbj"
Browse Forms
View Submissions
Generate PDF
Create Template
Configure Automation
```

Do not display actions that cannot currently be used without explaining why.

---

# App Status Card

Include an optional app health/status card.

Example:

```text id="s6b9ke"
App Status

Wix Forms          Connected
Events             Active
PDF Generation     Ready
Automation         2 Active
Plan               Pro
```

Use shadcn Badge components for status.

Possible badge states:

```text id="nz9zqr"
Connected
Ready
Action Required
Disabled
Error
Pro
Trial
```

This status card should be informational and not replace the onboarding checklist.

---

# Core Product Flow

The primary manual flow should be:

```text id="auvgkz"
Install App
    ↓
Verify Wix Forms is installed
    ↓
Load Wix Forms
    ↓
Select Form
    ↓
Browse Submissions
    ↓
Select Submission
    ↓
Resolve Form Schema
    ↓
Map Submitted Values to Fields
    ↓
Resolve Images / Files / Signatures
    ↓
Preview PDF
    ↓
Generate PDF
    ↓
Download PDF
```

The automatic flow should be:

```text id="rg07sy"
Submission Created Event
    ↓
Validate Event
    ↓
Check Duplicate Event
    ↓
Validate Instance / Site
    ↓
Validate Namespace
    ↓
Check Submission Status
    ↓
Read Form Automation Settings
    ↓
Resolve Form Schema
    ↓
Normalize Submission
    ↓
Resolve Images / Files / Signature
    ↓
Generate PDF
    ↓
Store PDF Record
    ↓
Run Configured Automation Actions
    ↓
Mark Event Completed
```

---

# Main App Areas

The application should contain:

1. Overview dashboard
2. Forms
3. Submissions
4. Submission details
5. PDF preview
6. PDF generation
7. PDF templates
8. Automations
9. Settings
10. Billing
11. Automation logs
12. Help and support

---

# Wix Forms Requirement

The Form Submission API only works when Wix Forms is installed on the site.

The app must confirm the Wix app named:

```text id="zvqt02"
wix_forms
```

is installed before enabling form functionality.

Use the supported Wix App Instance capability to confirm this.

If Wix Forms is unavailable, show a clear setup state.

Example:

```text id="t0b6nw"
Wix Forms Required

Forms PDF requires Wix Forms to access your form submissions.

Add or configure Wix Forms on your site, then return here.

[Refresh]
```

Do not silently fail.

---

# Wix Forms Namespace

For native Wix Forms submissions, support the namespace:

```text id="jksgee"
wix.form_app.form
```

Do not assume every submission returned by Forms APIs belongs to native Wix Forms.

Check the namespace before applying native Wix Forms-specific behavior.

---

# Wix Forms Integration

The app must work with native Wix Forms.

The app must support:

- Retrieving available forms
- Retrieving individual form schemas
- Retrieving form fields
- Retrieving submissions
- Retrieving individual submissions
- Pagination
- Sorting
- Filtering where supported
- Date filtering
- Submission status
- Submission revision
- Submitter information where available
- Contact ID where available
- File uploads
- Images
- Signatures

Do not invent Wix API methods.

Verify all Wix API capabilities before implementation.

---

# Event-Driven Architecture

New form submissions must be handled through Wix events.

Do not poll Wix repeatedly to discover new submissions.

Use the Wix Forms `Submission Created` event.

Relevant capability:

```text id="mviq9q"
Package: forms
Namespace: formSubmissions
Event: Submission Created
SDK Event: onSubmissionCreated
```

Required permission:

```text id="w4r2bo"
SCOPE.DC-FORMS.READ-SUBMISSIONS
```

Permission name:

```text id="uwlkcq"
Read Submissions
```

Example documented SDK pattern:

```ts id="394yq2"
import { submissions } from '@wix/forms';

submissions.onSubmissionCreated((event) => {
  // Handle submission
});
```

Verify the latest SDK implementation before coding.

---

# Submission Created Event Workflow

When `Submission Created` fires:

1. Receive the event.
2. Read the Wix event ID.
3. Read the app instance ID.
4. Read the site ID where available.
5. Check whether this event was already processed.
6. Read the submission entity.
7. Verify the submission namespace.
8. Read the submission status.
9. Identify the form.
10. Check whether automatic PDF generation is enabled.
11. Check the site's entitlement.
12. Retrieve or load the cached form schema.
13. Map submission targets to form fields.
14. Normalize answers.
15. Resolve signatures.
16. Resolve uploaded images.
17. Resolve other files.
18. Generate the PDF if applicable.
19. Save the PDF record.
20. Run configured follow-up actions.
21. Record processing results.
22. Mark the event as completed.

Do not query all submissions after each event.

Use the event's submission entity wherever possible.

---

# Submission Status Handling

Do not assume every new submission is complete.

Support:

```text id="8zb38k"
PENDING
CONFIRMED
PAYMENT_WAITING
PAYMENT_CANCELED
```

Default behavior:

- `CONFIRMED` → eligible for normal automatic PDF generation.
- `PENDING` → do not generate the final PDF by default.
- `PAYMENT_WAITING` → do not treat as completed by default.
- `PAYMENT_CANCELED` → do not generate a completed-submission PDF.

---

# Event Idempotency

Event deduplication is mandatory.

Use Wix's unique event ID.

Store processed events with fields such as:

```text id="hscfwe"
instanceId
eventId
eventType
entityId
formId
submissionId
status
receivedAt
processedAt
attemptCount
errorCode
errorMessage
```

Use:

```text id="91grr7"
instanceId + eventId
```

as the logical duplicate key.

Duplicate Wix events must never create duplicate PDFs, emails, webhook calls, or usage counts.

---

# Action-Level Idempotency

Individual automation actions must also be idempotent.

Examples:

```text id="uvd799"
submissionId:pdf:templateVersion
submissionId:email-owner
submissionId:email-submitter
submissionId:webhook
```

A retry should only retry the failed action.

---

# Form Schema Mapping

Submission answers use field targets.

Example:

```json id="383vkl"
{
  "short_answer_d8fe": "John",
  "file_upload_2f0c": []
}
```

Map:

```text id="lpene8"
target
→ field definition
→ field label
→ field type
→ submitted value
```

Never show raw targets in the normal UI.

---

# Supported Form Fields

Support at minimum:

- Short text
- Long text
- Email
- Phone
- Number
- URL
- Address
- Date
- Date/time
- Time
- Dropdown
- Radio
- Checkbox
- Multi-select
- Consent
- Signature
- File upload
- Image upload
- Rating
- Name
- Contact fields
- Structured values

Unsupported fields must use a generic safe renderer rather than fail.

---

# Signature Handling

The actual signature image must appear in the dashboard and PDF.

Do not show only:

```text id="y9ubce"
Signed
```

or:

```text id="3cw115"
signature.png
```

Requirements:

- Preserve aspect ratio
- Configurable width
- Configurable alignment
- Optional signer name
- Optional signed date
- Graceful fallback if unavailable

---

# Uploaded Images

Uploaded images must appear visually.

Support:

- JPG
- JPEG
- PNG
- WEBP
- Other safely renderable formats

Allow:

- Full width
- One per row
- Two-column grid
- Three-column grid

Optimize large files before embedding.

---

# Other Files

For unsupported visual formats, display:

- Filename
- Extension
- Type
- Size where available
- Download/reference link where supported

Do not fail PDF generation because an attachment cannot be rendered.

---

# Forms Page

Display:

- Form name
- Form ID
- Submission count where available
- Latest submission
- Assigned template
- Automation status
- Actions

Actions:

- View submissions
- Configure PDF
- Configure automation
- Generate latest PDF

Use shadcn Table, Card, Badge, DropdownMenu, Button, Skeleton, and Empty State patterns.

---

# Submissions Browser

Display:

- Selection
- Submitter
- Email
- Submission date
- Status
- Image indicator
- File indicator
- Signature indicator
- PDF status
- Actions

Support:

- Search
- Date filter
- Status filter
- Has signature
- Has image
- Has files
- PDF generated/not generated
- Pagination

Use shadcn UI for all filters, tables, dialogs, and actions.

---

# Submission Details

Show:

- Form name
- Submission ID
- Status
- Created date
- Updated date
- Submitter
- Answers
- Images
- Attachments
- Signature
- PDF status

Actions:

- Preview PDF
- Generate
- Regenerate
- Download
- Change template

Use shadcn Cards, Tabs, Badges, Dialogs, and Sheets.

---

# PDF Generation

The PDF system must support:

- Multi-page output
- Automatic page breaks
- Long answers
- Tables
- Images
- Multiple images
- Drawn signatures
- Headers
- Footers
- Page numbers
- Dynamic template values
- A4
- US Letter
- Multiple languages

---

# PDF Templates

Allow users to:

- Create
- Edit
- Duplicate
- Delete
- Set default
- Assign per form

Template configuration:

- Logo
- Header
- Subtitle
- Business details
- Fonts
- Font size
- Spacing
- Page size
- Margins
- Header
- Footer
- Image layout
- Signature size
- Signature alignment
- Hide empty fields
- Submission metadata
- Page numbers
- Branding
- Custom footer

Use shadcn Form, Tabs, Select, Slider, Switch, Input, Card, Accordion, Dialog, and Sheet components.

---

# Starter Templates

Provide:

1. Minimal
2. Professional
3. Modern
4. Legal / Agreement
5. Photo Report
6. Application
7. Inspection Report

---

# Template Variables

Support:

```text id="szovki"
{{formName}}
{{submissionId}}
{{submissionDate}}
{{firstName}}
{{lastName}}
{{email}}
{{siteName}}
{{currentDate}}
```

Use safe fallbacks for missing variables.

---

# Bulk PDF Generation

Allow:

- Generate selected
- Generate missing
- Download ZIP

Show progress with shadcn Progress.

Example:

```text id="8qg2sp"
Generating PDFs
17 of 25 completed
```

Failures should be individually retryable.

---

# Automation Settings

Allow automatic processing per form.

Example:

```text id="kc4nrk"
Automatic PDF Generation

[ON]

When a new confirmed submission is received:
✓ Generate PDF
✓ Store generated PDF
✓ Email site owner
□ Email submitter
□ Send webhook
```

Use shadcn Switch, Checkbox, Card, Alert, Input, and Form components.

---

# Automation Logs

Show:

- Submission
- Form
- Event time
- Event ID
- PDF action
- Email action
- Webhook action
- Status
- Retry count

Provide filters and retry actions using shadcn components.

---

# Billing

Support configurable plans such as:

## Free

- Limited PDFs
- One template
- Signature rendering
- Image rendering

## Pro

- Higher/unlimited PDFs
- Multiple templates
- Custom branding
- Bulk PDF
- ZIP
- Automatic generation
- Email features

## Business

- Advanced automations
- Webhooks
- Conditional templates
- Advanced retention
- Priority support

Do not hardcode pricing throughout the application.

---

# Feature Gating

Use centralized entitlement checks.

Examples:

```text id="1q8wyr"
canUseFeature("pdf_generation")
canUseFeature("bulk_pdf")
canUseFeature("automation")
canUseFeature("email_pdf")
canUseFeature("webhooks")
canUseFeature("remove_branding")
```

---

# Data Models

Create persistent models for:

- AppSettings
- FormSettings
- PdfTemplates
- PdfRecords
- ProcessedEvents
- AutomationActions
- UsageRecords
- AppInstance

All must be tenant-aware.

---

# Tenant Isolation

Every relevant record must be scoped by Wix app instance.

Never trust a browser-provided `instanceId`.

Resolve tenancy server-side.

---

# Security

Protect:

- Form data
- Signatures
- Uploaded files
- PDFs
- App credentials
- Webhook secrets

Requirements:

- Authentication
- Tenant validation
- Input validation
- HTML escaping
- SSRF protection
- Remote media validation
- File limits
- Rate limiting
- Sensitive log filtering

---

# Internationalization

Do not hardcode dashboard strings.

Support at least:

1. English
2. Spanish
3. French
4. German
5. Portuguese
6. Italian
7. Dutch
8. Polish
9. Swedish
10. Danish
11. Norwegian
12. Finnish
13. Japanese
14. Korean
15. Simplified Chinese
16. Traditional Chinese
17. Arabic
18. Hebrew
19. Turkish
20. Indonesian

Translate the onboarding checklist too.

---

# Accessibility

All shadcn-based UI must remain accessible.

Requirements:

- Proper labels
- Keyboard navigation
- Focus states
- Accessible dialogs
- Screen-reader-friendly status indicators
- Good contrast

---

# Responsive Design

Ensure the dashboard works on:

- Desktop
- Laptop
- Tablet
- Reasonable mobile sizes

The checklist should stack cleanly on smaller screens.

---

# Loading and Empty States

Use shadcn Skeletons for loading.

Use clear empty states for:

- No forms
- No submissions
- No PDFs
- No templates
- No automation logs

---

# Offline Handling

When offline, show a persistent dashboard message:

```text id="mw9ypp"
You are offline. Some features may be unavailable.
```

When restored:

```text id="877haa"
You're back online.
```

---

# Important UI Rule

Use shadcn/ui for all dashboard UI.

Do not use mixed visual systems.

Do not build raw unstyled HTML controls when a suitable shadcn component exists.

The final dashboard should look like one cohesive application.

---

# Important Event Rule

Do not poll for new submissions.

Use the Wix `Submission Created` event.

---

# Important Signature Rule

Render the actual signature image.

---

# Important Image Rule

Render uploaded images visually wherever possible.

---

# Important Reliability Rule

One bad field, image, signature, or attachment must never prevent the rest of a PDF from being generated.

---

# V1 Priority

The first version must reliably support:

1. Install app
2. Show onboarding checklist
3. Verify Wix Forms
4. List forms
5. Configure a form
6. Choose a PDF template
7. Browse submissions
8. Map form schema
9. Render answers
10. Render uploaded images
11. Render actual signatures
12. Generate test PDF
13. Download PDF
14. Handle new submissions through Wix events
15. Deduplicate events
16. Enable automatic PDF generation
17. Apply billing/entitlements
18. Record automation results
19. Display setup progress
20. Handle errors gracefully

---

# Final Deliverable

Build the complete working Wix App.

Do not deliver only mock screens.

The application must include:

- Complete shadcn dashboard UI
- Dashboard onboarding checklist
- Setup progress
- Wix Forms verification
- Forms retrieval
- Form schema retrieval
- Submission retrieval
- Submission Created event
- Event processing
- Event deduplication
- Action idempotency
- Form schema mapping
- Signature rendering
- Image rendering
- File handling
- PDF generation
- PDF preview
- PDF templates
- Bulk generation
- ZIP export
- Automatic PDF generation
- Automation logs
- Billing
- Entitlements
- Usage tracking
- Settings
- Multilingual support
- Security
- Tenant isolation
- Error handling
- Retry behavior
- Documentation
- Tests

The finished dashboard should feel like a polished SaaS product and be ready for real Wix App testing and eventual Wix App Market publication.