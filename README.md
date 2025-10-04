# Minecraft Tools

Tools and structured notes for keeping track of things while playing Minecraft.

## Project Roadmap

- [x] Authentication
- [x] Internationalization
- [x] Email Verification
- [x] Forgot Password
- [x] Design System (basics are in place, but it needs work)
- [ ] Bot Protection (https://www.youtube.com/watch?v=YzaChz8rCn0)
  - header analysis
  - captcha (browser fingerprint analysis)
  - rate limiting
  - disposable email detection
- [ ] Logging
- [x] Background Jobs
- [ ] Automated Test Suite
- [ ] Legacy Profession Data
- [ ] RELEASE
- [ ] Automated Database Backups
- [ ] Authorization
- [ ] Profile Management
- [ ] Worlds
- [ ] Compendium (statistics reference and search)
- [ ] Command (admin area especially for duplicating compendium for new game releases)
- [ ] Tools (multi-spawner farm calculator, villager trading hall notes et cetera)
- [ ] Communities
- [ ] Who's Who
- [ ] Schematics

## Development

This project is a labor of love. If you want to help (thank you!), please open an issue to coordinate work on the roadmap above.

To get started clone the project:

```shell
# github
git clone origin git@github.com:ravinggenius/minecraft-tools.git
# or gitlab if you like
# git clone origin git@gitlab.com:ravinggenius/minecraft-tools.git
cd minecraft-tools
```

Make sure you have the expected versions of JavaScript runtimes. I use `asdf` (install via Homebrew on macOS) to manage these:

```shell
cat .tool-versions
```

Install dependencies:

```shell
npm install
```

While that's running, copy `.env` to `.env.local`. Fill in or adjust any values in `.env.local` as needed.

```shell
cp .env .env.local
```

You will also need a Postgres connection string. I use `Postgres.app` on macOS, but any recent release of Postgres should work. [Atlas](https://atlasgo.io/) is used to manage database migrations. On macOS this can be installed with `homebrew`, but it is available for mutliple platforms. Some features that are used require a free account, so make sure you are logged in:

```shell
atlas login
```

To run migrations locally:

```shell
npm run migrate
```

Atlas requires `?sslmode=disable` if you aren't using a secure connection, which is the default for `Postgres.app` on macOS.

You may want to load some seed data:

```shell
npm run load | npx roarr
```

Then run the development server:

```shell
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) with your browser to see the result.

## Production

This project is meant to be hosted on [Vercel](https://vercel.com/). See the [Next deploy page](https://nextjs.org/docs/app/building-your-application/deploying) for more information.
