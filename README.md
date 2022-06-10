# Neon branching demo

This app is a simple collective blog model based on the `rest-nextjs-api-routes` example from the Prisma project. It is deployed on https://branching-demo-ts.vercel.app/ with the Postgres database running at http://neon.tech/.

The primary purpose of this repo is to demonstrate CI/CD setup which can catch SQL migration problems on production data before actually applying migrations on production.

This app uses GitHub action to run its tests. Vercel deploy happens only if tests succeed, that is why we trigger deploy from CI instead of using the Vercel bot (the bot will deploy PR regardless of CI status, see https://github.com/vercel/vercel/discussions/5776).

## CI/CD setup

This repo includes [.github/workflows/test_migrations.yaml](.github/workflows/test_migrations.yaml) script that does following:

1. For each PR CI script creates a production database branch using [Neon API](https://console.neon.tech/api-docs). Branch creating is instant, and all operations on the branch will not affect the main database.
2. CI script runs `npx prisma generate && npx prisma migrate deploy` against a branched database
3. If Prisma migration succeeded without issues, CI script will call `npx vercel` to deploy the app to Vercel and apply migration on prod

## Migration failure example

1. Ensure that [](prisma/schema.prisma) has `User.name` field typed as `String?`. If no, then commit a change to make it `String?`
2. Go to the [](https://branching-demo-ts.vercel.app/) and create a post with an empty name. That will end up in `User` table as a NULL value for the user name
3. Create a PR that changes the schema to force `not null` on user names (`String?` -> `String`). It will fail in the CI since migration will not pass
4. Go to the [](https://console.stage.neon.tech) and set some names to users with null names, e.g. `update "User" set name='Stas' where email='stas3@stas.to'`
5. Now re-run CI on the pull request. Go to `Actions`, select last run, and click `re-run all jobs` button in the top right corner. CI should pass now.

## How to set your test stand

Since Neon still has no shared projects, one will need to reconfigure this setup to run everything on their own account.

1. You will need GitHub, Vercel, and Neon accounts
1. Clone this repo to your GitHub account
1. Create a database in Neon
1. Attach the GitHub repo to your Vercel account. Go to the project setting in Vercel, the to `Environment Variables` and set the following env variables:
    * `NEXT_PUBLIC_URL_PREFIX` to `https://`
    * `DATABASE_URL` to the connection string to the Neon database. Save the password as you'll need it later.
1. Now clone your GitHub project locally and run `npx vercel link`. That will create `.vercel/project.json` file with `projectId` and `orgId` values. You'll need them in the next step.
1. Now set up secrets in a github repo, you'll need following variables:
    * `NEON_TOKEN` -- neon api token, get one at [](https://console.neon.tech/app/settings/api-keys)
    * `NEON_PG_CREDENTIALS` -- user:pass for your cluster, e.g. `stas:mypass`
    * `NEON_CLUSTER` -- neon cluster name, e.g. `lucky-field-758416`
    * `VERCEL_TOKEN` -- vercel api token, get one at https://vercel.com/account/tokens
    * `VERCEL_ORG_ID` -- `orgId` from the previous step
    * `VERCEL_PROJECT_ID` -- `projectId` from the previous step
1. All set, now you can deploy vercel prod by `npx vercel --token <your vercel token>` and start with migration failure example.
