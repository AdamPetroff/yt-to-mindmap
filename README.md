## What is this?

A system that uses AI to generate a mindmap from a youtube video. The idea was that if you don't feel like watching a whole 2+ hour podcast about health (Huberman Lab), you could use this system to generate a mindmap and you could go through all the topics and find what you're interested in. These long videos sometimes are annotated with chapters, but I felt like it's not enough.

You need to supply your own OpenAI API key. I'm using turborepo to manage the monorepo and there is a typescript types package that is shared between the frontend and backend. There is a docker setup included for the postgres DB.

## Limitations

- The mindmaps don't include all the information, especially in longer videos.
- Video length: videos around 10 minutes+ will break the backend, because the OpenAI API has a limit of 8000 tokens per request. and will not return a valid JSON.
- Somethimes OpenAI API generated JSON has inconsistent structure.
- The UI is too simple and design is non existent (I'm not a good designer rn)

## This is how it looks right now

Minimal UI (9.10.2023):
![Example](./example.png)

## Prerequisites

Install [Docker Desktop](https://docs.docker.com/get-docker) for Mac, Windows, or Linux. Docker Desktop includes Docker Compose as part of the installation.

## Development

- `cd apps/backend && cp .env.example .env`
- insert your OpenAI API key into the .env file
- `yarn install`
- `docker-compose up`
- `yarn dev`
- visit http://localhost:3000

<!-- ## Technical features

- Dockerized app with a frontend and backend services which share typescript types. Dev and prod versions.
- Next.js frontend with typescript, tailwindcss, app router (NEXT 13.4), server-side rendering with combined fetching (first time fetches data on server, then on client). -->

## TODO

- [x] Proper backend endpoints
- [x] Connect frontend to backend
- [ ] design
- [x] animation transitions (kind of done)
- [ ] better AI prompts
- [ ] authentication
- [ ] landing page
- [x] Turborepo

## Ideas

- Use NEXT server actions (experimental)
- ability to search string in the video transcript and jump to that point in the video
