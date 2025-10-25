## About The Project
This repository is the backend of the [ValoGraphs](https://valographs.com) project built with [NestJS](https://nestjs.com/).

## Getting started

### Prerequisites

To get this project running locally, you will need have a Postgres database set up on [supabase](https://supabase.com), a redis instance running either locally or on a [cloud provider](https://cloud.redis.io), and a [HenrikDev]('https://github.com/Henrik-3/unofficial-valorant-api) API key for the unofficial Valorant API.

### Installation

1. Clone the repository

```bash
git clone https://github.com/jfang324/vg-backend.git
```

2. Install dependencies

```bash
npm install
```

3. Run the database migrations
```bash
npx supabase db push
```

4. Generate the API clients and supabase types

```bash
npm run generate-api-client && npm run generate-supabase-types
```

5. Create a ```.env``` file in the root directory of the project following the example ```.env.example```

6. Start the development server
```bash
npm run start:dev
```

7. (optional) Run the test suites to make sure everything is working
```bash
npm run test:cov
```

## Tools & Technologies

- [NestJS](https://nestjs.com/)
- [Postgres](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Jest](https://jestjs.io/)
- [Docker](https://www.docker.com/)
- [Github Actions](https://github.com/features/actions)
- [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator)
- [Supabase](https://supabase.com/)