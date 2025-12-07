## Real Estate Platform (Diplomski) — Presentation README

A modern web app for discovering, posting, and managing real estate listings, with secure accounts and in‑app messaging between buyers and owners/agents.

### What it does (in a nutshell)

- Browse properties for rent or for sale with smart filters (city, neighborhood, price, size, rooms, amenities).
- View rich property details with photos and contact options.
- Create an account, log in, and manage your own listings (add, edit, delete).
- Send and receive messages about listings; see unread counts to stay on top of inquiries.
- Edit your profile, change password, and keep data secure with token‑based authentication.

### Who it’s for

- Buyers and renters looking for apartments, houses, studios, land, or commercial spaces.
- Owners and agents who want to list properties and respond to inquiries efficiently.

## Key Screens (demo flow)

- Home and Search: quick location search, filters (rent/buy), and price range.
- Results: clean cards with key info and quick actions.
- Property Details: gallery, features, price, location context, and contact.
- My Properties: manage your own listings.
- Messages: see conversations and unread messages.
- Profile/Settings: update personal info and password.

## System at a glance

- Frontend: React (Vite) with a clean, responsive UI.
- Backend: Node.js + Express (TypeScript), documented REST API.
- Database: PostgreSQL via TypeORM (reliable, structured data).
- Auth & Security: JWT bearer tokens; protected routes and role support.
- API Documentation: Swagger UI available at `/api-docs`.
- Containerization: Docker configuration included for easier deployment.

## Data model (simple overview)

- User: account info, role (user/agent), credentials.
- Property: title, description, type, listing type (rent/buy), location, price, size, features, images, owner.
- Message: sender, recipient, optional property link, subject, body, read/unread status.

## Highlights and design choices

- Clear separation of concerns: a dedicated backend API and a modern SPA frontend.
- Focus on usability: straightforward flows for search, details, and contact.
- Scalability: typed backend with entities, migrations, and query builder.
- Maintainability: API documented with Swagger for quick onboarding and testing.

## Edge cases and safeguards

- Ownership checks: only the listing owner can edit or delete a property.
- Validation:
  - Required fields when creating a property; at least one image on create.
  - Clean handling of numeric fields (price, area, rooms).
  - Unique email/username on registration; minimum password length.
  - Password changes require the current password.
- Messaging rules:
  - Prevents sending a message to yourself.
  - Unread message count for quick status awareness.
- Listings visibility:
  - Defaults to showing only “available” listings in public results.

## How to run (quick guide)

This is a high-level overview for demo purposes.

- Prerequisites: Node.js and PostgreSQL installed (or use Docker).
- Backend
  1. `cd backend`
  2. `npm install`
  3. Configure database via environment variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`) or use defaults.
  4. Start the API: `npm run dev` (Swagger at `/api-docs`).
- Frontend
  1. `cd frontend`
  2. `npm install`
  3. Start the app: `npm run dev` (opens in the browser).
- Note: Ensure the frontend API base URL matches the backend address.

## Demo suggestions (for the presentation)

1. Show the landing page and quick search with filters.
2. Open a property detail: highlight photos, price, features.
3. Register/Login, then create a new property with images.
4. Switch to another account (or use a second browser) to send a message.
5. Return to the first account and show unread count and conversation.
6. Edit the property, then delete it to demonstrate ownership rules.
7. Briefly open `/api-docs` to show the documented endpoints.

## What was used (technology summary)

- React, Vite, and modern CSS utilities for the UI.
- Node.js, Express, and TypeScript for a robust, typed backend.
- PostgreSQL with TypeORM for reliable data persistence.
- JWT for authentication; Swagger for API documentation.
- Docker files included to simplify setup in production.

## Future improvements

- Favorites and saved searches with email notifications.
- Advanced map view and geospatial filters.
- Image optimization and CDN support.
- Role‑based dashboards for agents vs. regular users.
- Better moderation and reporting tools for listings/messages.

## Credit and ownership

Developed as part of the diplomski (graduation) project. All source code and assets belong to the project author.

## Contact

For questions or feedback, please contact the project author or open an issue.

## Midterm presentation (faculty requirements)

- Why this topic:
  - Real‑world impact: renting/buying is a common pain point.
  - Local market gaps: fragmented listings, inconsistent data quality, weak messaging.
  - Strong full‑stack learning: UI/UX, APIs, auth, and data design.
- Overview of existing solutions:
  - Global platforms (e.g., Zillow): great UX/data, but not localized to our market.
  - Local/regional portals: basic filters, mixed data reliability, messaging often external.
  - Social media groups: reach but poor structure/search; not suitable for transactions.
- Goal by the end:
  - Complete discovery → evaluation → contact flow.
  - Owners/agents manage listings; buyers/renters use smart filters.
  - Secure accounts with profile update and password change.
  - Documented REST API and a polished demo scenario.
- Plan and work dynamics (until semester end):
  - Week 1–2: UX polish, accessibility, image handling improvements.
  - Week 3: Favorites and saved searches (basic alerts).
  - Week 4: Admin/moderation basics, reporting/flagging.
  - Week 5: Map view and location filters (Google Maps links).
  - Week 6: Performance, tests, docs, and demo rehearsal.

### Presentation materials

- Slides (HTML): `docs/presentation/midterm_presentation.html`
- Outline (Markdown): `docs/presentation/outline.md`
