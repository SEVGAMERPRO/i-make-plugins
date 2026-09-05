# Contributing to Minoforge.com

We love contributions from the community! This document outlines the process for proposing changes, submitting pull requests, and maintaining code quality.

## Getting Started

1. **Fork the repository** and clone it locally.
2. **Create a new branch** for your work:
   ```bash
   git checkout -b my-feature-branch
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Run the development servers** to ensure everything works:
   ```bash
   pnpm dev
   ```

## Code Style

- Use **TypeScript** for both frontend and backend.
- Run `pnpm lint` before committing.
- Format code with `pnpm format` (Prettier).
- Follow the existing project structure.

## Submitting Changes

1. Commit your changes with a clear message.
2. Push your branch to your fork.
3. Open a **Pull Request** against the `main` branch.
4. Ensure the CI pipeline passes.
5. Request a review from a maintainer.

## Testing

- Add or update unit tests as needed.
- Run `pnpm test` locally.

## Documentation

- Update the `README.md` if you add new features.
- Keep any new diagrams in the `docs/` folder.

Thank you for helping make Minoforge better!
