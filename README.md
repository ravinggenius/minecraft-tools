# Minecraft Tools

Tools and structured notes for keeping track of things while playing Minecraft.

Open [http://localhost:3000/](http://localhost:3000/) with your browser to see the result.

## Project Roadmap

- [x] Next 13
- [x] Authentication
- [ ] Internationalization
- [ ] Email Queueing
- [ ] Forgot Password
- [ ] Bot Protection (https://www.youtube.com/watch?v=YzaChz8rCn0)
  - header analysis
  - captcha (browser fingerprint analysis)
  - rate limiting
  - disposable email detection
- [ ] Background Jobs (session management at least)
- [ ] Design System
- [ ] Legacy Profession Data
- [ ] RELEASE
- [ ] Automated Database Backups
- [ ] Authorization
- [ ] Profile Management
- [ ] Worlds
- [ ] Compendium (statistics reference)
- [ ] Command (admin area especially for duplicating game versions)
- [ ] Tools (multi-spawner farm calculator, villager trading hall notes et cetera)
- [ ] Communities
- [ ] Who's who
- [ ] Schematics

## Development

This project is a labor of love. If you want to help (thank you!), please open an issue to coordinate work on the roadmap above.

Install dependencies:

```shell
npm install
```

While that's running, copy `.env` to `.env.local` and adjust any values you need to. Most values can be left alone, but (Postgres) `DATABASE_URL` is required. Any values not set will fall back to `.env`.

```shell
cp .env .env.local
```

Then run the development server:

```shell
npm run dev
```

## Production

This project is meant to be hosted on (Vercel)[https://vercel.com/]. See the (Next deploy page)[https://nextjs.org/docs/app/building-your-application/deploying] for more information.
