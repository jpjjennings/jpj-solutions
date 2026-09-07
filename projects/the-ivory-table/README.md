# The Ivory Table

Restaurant website sample for the JPJ Solutions portfolio.

## Modes

- `npm run dev` runs the Vite frontend and the Express/SQLite reservation API.
- `npm run build` creates the production frontend, which expects the API to be
  served by `server.js`.
- `npm run build:demo` creates the static portfolio version. Reservations show
  the confirmation flow without storing personal data.

The generated static demo is published at `/projects/the-ivory-table/` by the
parent portfolio site. Application source lives in `app/`; the generated
deployment files are copied to the project root (and retained in `dist/`).
