# PROJECT REBRAND — AUTO-EXECUTE INSTRUCTIONS

> **How to use this file**
> Tag this file in Copilot Chat (`#file:PROJECT_REBRAND.PROMPT.md`) and drop the following alongside it:
>
> 1. A ChatGPT design prompt (describing the new resort's vibe, colors, and style)
> 2. Screenshots of a reference website (drag them in)
> 3. HTML source files from the reference site (optional but helpful)
> 4. The new project/resort name
> 5. The domain (e.g. `sunsetcove-resort.com`)
> 6. MongoDB URI for the new project
> 7. Facebook page URL
> 8. App/SMTP password for the resort's email account
> 9. The URL of the reference website (so the AI can fetch images and assets directly from it)
> 10. Optional explicit project ID (if omitted, AI must generate one from project name in format `PPPP-XXXXXXXX`, e.g. `ELMR-MOY674ZZ`)
>
> That is all. Do NOT copy any prompt text manually. This file tells the AI exactly what to do.
> The AI will extract all values from what you drop and execute every step automatically.

---

```md
You are an expert full-stack JavaScript engineer and UI redesign specialist.

I copied an existing hospitality website project into a new project folder.

I will give you some combination of the following:

1. A ChatGPT prompt describing the design direction
2. Website screenshots
3. HTML source files from the website I want to study
4. Existing project structure
5. Existing project UI
6. Existing database structure
7. Existing routes/pages
8. Existing components

Your job is to transform this copied project into a new project for the latest brand I am building.

This is NOT a direct clone task.

This is a:

- new project bootstrap task
- full project rebrand task
- frontend redesign task
- content remapping task
- environment/config cleanup task

You must preserve working backend logic where possible, but everything that still reflects the old copied project must be updated to the new project.

## Primary Goal

Take the existing copied project and convert it into a new branded hospitality website by doing all of the following:

1. Rename the project everywhere relevant to the new project name
2. Update frontend, backend, and email-service environment/config values to match the new brand
3. Analyze the provided screenshots / HTML / prompt / existing structure
4. Preserve the useful content architecture and business flows
5. Redesign the frontend into a premium modern hospitality experience
6. Keep booking/payment/auth/backend behavior working unless a specific change is required

## Critical Rule

If the design prompt I provide mentions a stack that does NOT match this actual repository, do NOT blindly rewrite the app into that stack.

Instead:

- inspect the current project first
- identify the actual stack already used in this repo
- keep the existing stack unless I explicitly ask for a migration
- adapt the design intent into the existing stack

Example:

- if the prompt mentions Next.js but the repo uses React + Vite, keep React + Vite unless I explicitly request migration
- if the prompt mentions TypeScript but the repo is plain JSX/JS, do not migrate unless I ask for that

## How To Extract Project Details (do not ask the user to fill in placeholders)

The user will drop their inputs alongside this file. Extract every value you need directly from what they provide.

Do NOT ask the user to fill in placeholders. Do NOT leave any `<PUT_...>` tokens in any file.

Extract from their inputs:

- **Project name / resort name** — from the name they type or from the ChatGPT prompt / HTML title
- **Project ID** — use provided ID if given; otherwise generate one using format `PPPP-XXXXXXXX` where `PPPP` is derived from the project/resort name and `XXXXXXXX` is 8 uppercase alphanumeric characters. Example: `ELMR-MOY674ZZ`.
- **Domain** — from what they type (e.g. `sunsetcove-resort.com`); derive all URLs from it:
  - frontend dev: `http://localhost:5173`
  - frontend prod: `https://www.{domain}`
  - backend prod: if deployed on Render, prefer `https://{render-service-name}.onrender.com`; otherwise use `https://api.{domain}` or `https://{domain}/api` and flag the choice
  - email-service URL: if deployed on Vercel, prefer `https://{email-service-project-name}.vercel.app/api/send`; otherwise use `https://email.{domain}` or note it as TBD if unclear
- **MongoDB URI** — from what they paste
- **Facebook URL** — from what they paste or drop
- **SMTP / app password** — from what they provide; the email username is `reservations@{domain}` or similar — infer it from context
- **Admin email** — infer as `owner@{domain}` or use whatever they name
- **Brand colors** — extract from screenshots or the ChatGPT prompt if color names/hex values are mentioned
- **Tone / tagline / short name** — extract from the ChatGPT prompt or reference HTML

If any value cannot be determined from the provided inputs, make a reasonable default and add it to the "Manual values you must still set" section of your final summary.

## Project ID Generation Rule (Mandatory)

For every new project start, ensure a project ID exists and is applied.

- If user provides a project ID, validate and use it.
- If user does not provide one, generate a new ID in this exact pattern: `PPPP-XXXXXXXX`.
- `PPPP` must be a 4-letter uppercase prefix derived from the project/resort name (not hardcoded globally).
- Prefix derivation rule: remove spaces/punctuation and common filler words (`the`, `resort`, `hotel`, `and`), then build a 4-letter uppercase code from significant words/characters.
- `XXXXXXXX` must be 8 uppercase alphanumeric characters (`A-Z`, `0-9`).
- If a provided ID prefix does not match the current project name and no org-level override is explicitly requested, auto-correct to a project-name-based prefix and document the correction in the final summary.
- Do not reuse a previous project's ID.
- Add/update this value in env/config as `PROJECT_ID` where applicable (backend, email-service, and frontend env/config if present).
- Include the final value in the output summary under "Env/config values changed".

## Required Inputs — Use All Of Them

When the user provides any of these, you must use them:

- screenshots → study layout, hierarchy, colors, typography, imagery style
- HTML source files → extract content, section copy, room info, contact details
- ChatGPT design prompt → extract vibe, tone, colors, style direction
- reference site URL → fetch the page, extract image URLs (hero images, room photos, gallery shots, background textures); download and save them into `frontend/src/assets/` or `frontend/public/` as appropriate; use them in the redesigned frontend
- project name, domain, MongoDB URI, Facebook URL, SMTP password → apply to env/config files directly

Treat reference materials as direction, not as instructions to clone UI literally.

## Phase 1 — Analyze First

Before editing, inspect the current project and determine:

- actual frontend stack
- actual backend stack
- current route/page structure
- current component structure
- current branding/config files
- environment files present
- where the old project name appears
- where URLs, domains, emails, and social links appear

Also analyze any screenshots / HTML / reference materials I provide and extract:

- section order
- content hierarchy
- room information
- amenities
- gallery structure
- contact details
- layout patterns
- imagery usage
- hospitality tone

If a reference site URL is provided:

- fetch the page using available browser/fetch tools
- identify all meaningful image URLs (hero, rooms, gallery, backgrounds, banners)
- download each image and save it into `frontend/src/assets/` using descriptive filenames (e.g. `hero-bg.jpg`, `room-deluxe.jpg`, `gallery-pool.jpg`)
- use these downloaded images in the redesigned components instead of placeholders
- if an image cannot be downloaded, note it in the "Manual values you must still set" section

Do NOT:

- blindly rebuild the old design
- preserve outdated styling just because it exists in screenshots or HTML
- migrate stacks unless explicitly requested

## Phase 2 — Rename The Entire Project Correctly

You must update all relevant old-brand references to the new project.

This includes, when present:

- README title and copy
- frontend HTML title/meta tags
- package names if needed
- visible labels in the UI
- brand helper/config files
- environment files
- email sender labels
- receipt branding
- footer/contact details
- social links
- domains and API/service URLs

The new project name must be reflected consistently across:

- frontend
- backend
- email-service

If there is a frontend env file or frontend env usage, update that too.

## Exact Env / Config Coverage

Review and update all relevant values in:

- backend/.env
- backend/.env.example if present
- email-service/.env
- email-service/.env.example if present
- frontend env files if present
- config files that hardcode brand, domain, social links, sender identity, or service URLs

## Mandatory Update Map (Where To Update)

When building a new project, update these locations first (if file exists), then run workspace search for leftovers.

### Root / Meta

- `README.md` (project name, domain, setup instructions)
- `render.yaml` / deployment manifests (service names, env vars, domains, Render backend URL derivation)
- `PROJECT_REBRAND.PROMPT.md` (keep rules current if process changes)

### Backend — Required Files

- `backend/.env`
- `backend/.env.example`
- `backend/config/email.js` (only if the backend mailer is still wired; otherwise rely on email-service config)
- `backend/config/logger.js` (service/app label)
- `backend/models/Booking.js` (booking reference prefix logic must derive from `PROJECT_ID`, never hardcoded)
- `backend/scripts/migrateBookingRefs.js` (prefix migration logic must support current `PROJECT_ID` prefix)
- `backend/scripts/seedAdmin.js` and other seed scripts (admin email/name defaults)
- `backend/server.js` and route config files for URL/CORS usage

### Email Service — Required Files

- `email-service/.env`
- `email-service/.env.example`
- `email-service/api/send.js` (subject lines, sender names, contact/footer links)
- `email-service/dev-server.js` (service labels, local URLs if hardcoded)

### Frontend — Required Files

- `frontend/.env`
- `frontend/.env.production` (must update `VITE_API_URL` to current backend production URL; if backend is on Render, derive from `render.yaml` service name)
- `frontend/index.html` (title/meta/og/twitter brand text)
- `frontend/src/lib/brand.js` (single source for name, tagline, phone, email, domain, socials, `projectId`, and any hardcoded API URL if present)
- `frontend/src/services/api.js` (API base URL usage)
- `frontend/src/components/layout/*` (navbar/footer contact + socials)
- `frontend/src/pages/Contact.jsx` and other public pages containing business info
- `frontend/src/lib/pdfGenerator.js` and receipt-related components (branding + reference labels)

### Fallback Discovery (Must Run)

After direct edits above, search workspace and replace stale values:

- old project name / short name
- old domain and API host
- old Render URLs / previous `.onrender.com` hosts
- old email addresses and phone numbers
- old Facebook URLs
- old booking/reference prefixes (for example `LLVC-`, `LLZ-`, or previous project code)

Do not finish until these searches return no unintended stale values.

At minimum review and replace values for:

### Backend

- PROJECT_ID
- ADMIN_EMAIL
- RESORT_PHONE
- RESORT_EMAIL
- FACEBOOK_PAGE_URL
- CLIENT_URL
- EMAIL_SERVICE_URL
- JWT_SECRET

Also verify these if the deployment changed:

- PORT
- MONGODB_URI
- NODE_ENV
- LOG_LEVEL
- JWT_EXPIRES_IN
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- EMAIL_SERVICE_API_KEY

### Email Service

- PROJECT_ID
- SMTP sender identity if branded
- service/base URLs
- allowed origins / CORS-related values
- resort/business contact values
- API keys if they are tied to deployment
- admin email
- social links

### Frontend / Brand Config

- PROJECT_ID
- brand display name
- short name
- tagline
- address
- phone
- email
- domain
- social links
- frontend API base URL or env usage

**⚠️ CRITICAL: Keep phone & Facebook synced!**
When updating contact info, update BOTH:

1. `frontend/src/lib/brand.js` (phone, facebookPageUrl)
2. `email-service/.env.production` (RESORT_PHONE, FACEBOOK_PAGE_URL)
   These are separate and don't auto-sync. Both need manual updates.

## Phase 3 — Redesign The Frontend

Use the screenshots, HTML, and prompt I provide as inspiration and content sources.

Your job is NOT to make a pixel-perfect clone.

Your job is to:

- preserve content direction
- preserve hospitality atmosphere
- preserve useful section architecture
- preserve important room/contact/business content
- redesign the UI into a premium modern experience
- use images fetched from the reference site URL wherever they fit the new design

The final frontend should feel:

- cinematic
- immersive
- refined
- premium
- elegant
- spacious
- modern hospitality inspired
- responsive

Avoid:

- template-looking UI
- obvious clone styling
- outdated hotel layouts
- generic boxed sections
- cramped spacing
- weak typography

## Frontend Redesign Scope

Apply redesign/content changes across all relevant pages and sections, including when present:

- navbar
- footer
- hero
- home sections
- about page
- rooms page
- gallery page
- contact page
- booking-related promotional UI
- cards, banners, CTA blocks, and section headers

Keep the existing route structure compatible unless I explicitly ask for routing changes.

## Design Behavior Rules

1. Preserve business logic

- do not break booking
- do not break payment flow
- do not break auth/admin behavior
- do not break API contracts unless required

2. Keep backend architecture intact

- routes should remain compatible
- services/controllers should not be rewritten unnecessarily

3. Modernize presentation

- improve typography
- improve spacing
- improve responsiveness
- improve hierarchy
- improve room presentation
- improve gallery presentation
- improve storytelling

4. Reuse and reorganize content intelligently

- extract useful text from screenshots/HTML if provided
- reuse image assets where appropriate
- map old content into new sections cleanly

## Tech Stack Rule

Use the existing repository stack by default.

Only use libraries already in the project unless:

- a new library is clearly necessary
- it fits the existing stack
- it does not cause unnecessary migration/refactor cost

If my reference prompt suggests libraries that do not fit the current stack, translate the design intent into the current codebase instead of forcing those tools.

## Code Quality Rules

The final code should:

- stay consistent with the existing code style
- avoid unrelated refactors
- use reusable components where appropriate
- remain scalable and maintainable
- preserve working functionality

## Validation Steps

After making changes:

1. Run install/build checks for frontend, backend, and email-service when applicable
2. Ensure no broken imports or routes
3. Ensure renamed env/config values are referenced correctly
4. Confirm the old project name is no longer present where it should have been replaced
5. Confirm the new brand is reflected in frontend, backend, and email-service

## Output Format

Return your final summary using exactly these sections:

1. What I changed
2. Files updated
3. Env/config values changed
4. Manual values you must still set
5. Run commands

Now perform the changes directly in this workspace.
```

---

> **Reminder:** To use this file, tag it with `#file:PROJECT_REBRAND.PROMPT.md` in Copilot Chat and drop your inputs alongside it:
> project name · domain · MongoDB URI · Facebook URL · SMTP/app password · reference site URL · ChatGPT design prompt · screenshots · HTML
>
> No copying, no placeholder filling. The AI reads this file, fetches images from the reference URL, and executes everything automatically.
