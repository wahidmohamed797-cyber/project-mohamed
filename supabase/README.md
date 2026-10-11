# Supabase setup

This project uses Supabase for hosted PostgreSQL and user authentication. The
database schema and row-level security policies are defined in
`migrations/20261011000000_initial_schema.sql`.

## Apply the initial database schema

1. Create a Supabase project using its free plan.
2. Open the project's SQL Editor.
3. Copy the migration SQL into a new query and run it once.
4. Keep the project's database password and service-role/secret key private.

## Browser authentication configuration

`../supabase-config.js` contains the project URL and publishable key. A
publishable key is expected to be visible to website visitors; database row
level security is what protects user data. Never replace it with a secret or
service-role key.

In the Supabase dashboard, configure the Auth URL settings to allow the exact
local development and deployed website URLs before testing email confirmation.
The sign-up form returns users to the current `auth.html` URL.

The migration creates a profile when an auth user signs up, plus customer,
employee, project, and task tables. Each record belongs to its creating account;
row-level security and composite foreign keys prevent accounts from reading or
linking one another's records.

## Security notes

- Do not put a database password, service-role key, or secret key in browser
  code or commit one to GitHub.
- A Supabase publishable/legacy anon key may be used by browser code only when
  row-level security is enabled and correctly configured. The migration
  restricts table access to authenticated users and their own rows.
- The sign-in page and customer, employee, project, task, dashboard, profile,
  and report pages use Supabase. The project/customer/task records previously
  saved in `localStorage` remain in that browser but are not automatically
  imported into the database.
- The website uses its publishable key in browser code. Do not put a database
  password, service-role key, or secret key there.
- Configure the Auth URL allow list before deploying, use HTTPS for public
  access, and test account isolation with separate accounts before sharing the
  deployed site.
- Do not open the application through `file://`; use a local HTTP server or a
  deployed HTTPS URL so authentication redirects work.
