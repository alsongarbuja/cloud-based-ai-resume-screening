# KaamAI - Dashboard Side

This is the dashboard part of the overall KaamAI project.

### Table of contents

- [Tech Stack](#tech-stacks)
- [Getting starting](#getting-started)
- [Develop locally](#local-development)
- [Production](#production-deployment)

## Tech stacks

Following are the tech stacks used to build this dashboard.

- [Vite - Build Tool](https://vite.dev/)
- [React - Framework](https://react.dev/)
- [Tailwindcss - Styling](https://tailwindcss.com/)
- [Tanstack - API integration](https://tanstack.com/)

## Getting started

To start running this project you need this following:

1. A js package manager [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
2. Install the packages `npm i` or `pnpm i`
3. Add a `.env` file at the root of the _kaam-ai-dashboard_ folder
4. Add following into the env file and add your own configuration

```env
VITE_API_BASE_URL=<api-base-url>
```

5. Follow the below [local development](#local-development) steps

## Local development

To run the project locally follow the following steps.

> [!Warning]
>
> Since it is in early development there are still changes to be made in this project such as creation of environment files.

1. `cd` into _kaam-ai-dashboard_ folder

```bash
cd kaam-ai-dashboard
```

2. Start the project with this command

```bash
pnpm dev
```

## Production deployment

For the production deployment a github actions will be soon written.
