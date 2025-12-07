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
