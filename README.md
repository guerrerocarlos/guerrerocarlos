# guerrerocarlos

Same-name W7S root app test for `guerrerocarlos.w7s.cloud`.

This repo intentionally has the same name as the GitHub user. W7S should deploy it to:

```text
https://guerrerocarlos.w7s.cloud/
```

Layout:

- `backend/src/index.ts`: Hono Worker API source.
- `backend/index.js`: generated bundled backend deployed by W7S.
- `frontend/src`: React frontend source.
- `frontend/dist`: generated static frontend deployed by W7S.

The generated deploy artifacts are ignored by git. The GitHub Actions workflow runs:

```sh
npm ci
npm run build
```

before uploading the repo archive to W7S.

Local commands:

```sh
npm install
npm run check
npm run dev
```
