# Minecraft Tools

Tools and structured notes for keeping track of things while playing Minecraft.

## Project Roadmap

- [x] Next 14
- [x] Authentication
- [x] Internationalization
- [x] Email Verification
- [x] Forgot Password
- [x] Design System
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

Install dependencies:

```shell
npm install
```

While that's running, copy `.env` to `.env.local`. Fill in or adjust any values in `.env.local` as needed.

```shell
cp .env .env.local
```

You will also need [Atlas](https://atlasgo.io/) to manage database migrations. On macOS this can be installed with `homebrew`, but it is available for mutliple platforms. Some features that are used require a free account, so make sure you are logged in.

To run migrations locally:

```shell
npm run migrate -- --url "postgresql://localhost/minecraft-tools?sslmode=disable"
```

`?sslmode=disable` is required if you aren't using a secure connection. This is the default for `Postgres.app` on macOS.

Then run the development server:

```shell
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) with your browser to see the result.

## Production

This project is meant to be hosted on [Vercel](https://vercel.com/). See the [Next deploy page](https://nextjs.org/docs/app/building-your-application/deploying) for more information.
