# Streamtide Farcaster Frame

This is a [Farcaster Frame](https://docs.farcaster.xyz/developers/frames/) for making donations to [Streamtide](https://streamtide.io) users directly from any Farcaster app.

## Development guide

This is a [Next.js](https://nextjs.org/) project.

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The entry page is in `app/page.tsx`.

The different frames handler for regular buttons are in `app/api/frame`.

The endpoint to fetch transaction details for 'tx' buttons are in `app/api/tx`

