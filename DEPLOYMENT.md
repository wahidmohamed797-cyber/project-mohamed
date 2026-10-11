# Tech Flow deployment

The public repository already has a live GitHub Pages site at
`https://wahidmohamed797-cyber.github.io/project-mohamed/`. GitHub Pages serves
the current `main` branch; Supabase provides authentication and PostgreSQL.

## Publish this update

This update is prepared on a review branch based on the published repository.
Review and merge that branch into `main`; the existing GitHub Pages deployment
will automatically publish it. Do not force-push the separate local `main`
branch or change the repository's Pages source.

The source code is public. The Supabase publishable key in
`supabase-config.js` is public by design; never put database passwords,
service-role keys, or other secrets in the repository.

## Configure Supabase email redirects

Before creating accounts from the public URL, open **Supabase → Authentication
→ URL Configuration**:

- Set **Site URL** to
  `https://wahidmohamed797-cyber.github.io/project-mohamed/`.
- Add
  `https://wahidmohamed797-cyber.github.io/project-mohamed/auth.html` to the
  allowed redirect URLs.
- Keep the deployed GitHub Pages `auth.html` URL as the password recovery
  redirect target too.
- Keep the exact local `auth.html` URLs used by Live Server in the allowed
  redirects for local testing.

Once the new site version has been merged and deployed, open its `auth.html`
page, create a separate test account, and verify it can only access its own
records before sharing the site with friends.
