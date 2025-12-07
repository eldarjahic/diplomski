# Midterm Presentation — Outline

## 1. Title
- Real Estate Platform
- Midterm Presentation
- Author: Eldar
- Date: Nov 14, 2025

## 2. Why this topic?
- Practical, high-impact problem (rent/buy flow is complex).
- Local market gaps: fragmented listings, inconsistent quality, limited messaging.
- Great full‑stack exercise: UI/UX + API + auth + data modeling.
- Scalable path for future features.

## 3. Existing solutions (overview)
- Global: Zillow (excellent UX/data; not localized).
- Local/regional portals: basic filters, mixed data reliability, messaging often external.
- Social media groups: reach but poor structure and searchability.
- Opportunity: unified, structured, user-friendly local experience with built-in communication.

## 4. Goal by project end
- Full discovery → evaluation → contact flow.
- Owners/agents: manage listings (create/edit/delete) with images.
- Buyers/renters: smart filters (city, neighborhood, price, area, rooms, amenities).
- Secure accounts and profile management (JWT, password change).
- Documented REST API; polished demo scenario.

## 5. Implemented so far
- React (Vite) frontend with responsive UI and search.
- Property details with images and key features.
- Auth: register, login, profile edit.
- Listings: create, update, delete (owner only).
- Messaging with unread counters.
- Express + TypeScript API, PostgreSQL + TypeORM, Swagger docs.

## 6. Architecture (high-level)
- Frontend: React SPA (routing, components).
- Backend: Express (TypeScript), JWT auth, modular routes.
- DB: PostgreSQL with TypeORM (entities, migrations).
- Docs: Swagger (`/api-docs`).
- Deployment: Docker files included.

## 7. Plan & work dynamics (until semester end)
- Week 1–2: UX polish, accessibility, image improvements.
- Week 3: Favorites and saved searches (basic alerts).
- Week 4: Admin/moderation basics, reporting.
- Week 5: Map view and location filters (Google Maps links).
- Week 6: Performance, tests, docs, demo rehearsal.

## 8. Risks & mitigations
- Data quality → validation, required fields, enums.
- Security → JWT, ownership checks, password rules.
- Images/storage → size limits, first image as cover; later CDN.
- Performance → server-side filters, indexes, profiling.

## 9. Demo plan
- Search & filters → Results → Details.
- Login → Create listing (with images).
- Second account → Send message; first account → unread count + conversation.
- Show `/api-docs` for API coverage.

## 10. Q&A
- Invite questions and feedback.


