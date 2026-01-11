Backend refactor and test updates

Summary

- Refactored backend route handlers to use async/await and improved error handling.
- Exported Express `app` from `backend/app.js` so tests can require it without starting a server.
- Tests added under `backend/test/` using: `mocha`, `chai`, `supertest`, `nock`, and `mongodb-memory-server`.
- Added DB-backed test example (`items.db.test.js`) which uses an in-memory MongoDB instance.

How to run backend tests locally

```bash
cd backend
npm install --legacy-peer-deps --no-audit --no-fund
npm test
```

Notes

- The project still supports the existing Postman/Newman tests (script `test:postman`).
- If you want these changes merged to `main` I can open a PR for you.
- I can also add additional DB-backed tests for `users`, `comments`, and auth flows on request.
