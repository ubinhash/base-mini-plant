// export async function GET() {
//   return Response.json({
//     accountAssociation: {
//       header: "eyJmaWQiOjExMTMxNTgsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg0NTExQWUzNUYyYzM2MDU5ZjMwMjUyMzBjZDQ0MTc4NDI3NjQzMTc1In0",
//       payload: "eyJkb21haW4iOiJtaW5pLXBsYW50LnZlcmNlbC5hcHAifQ",
//       signature: "MHhkMWE1Yjc4ZmQ5YTBiMTBlMGI2MTU3NjU5MjZkYzU2ZWZlMTA5MzhlNDUxNmU3YmI0MDQ1MTNkOGI5MTlmYzIyNGY2ZmNkNzMyMWIyYTYwNTUyMDU4MmI3MTU3ZWViOTUwNWMxYTZlMjYxNWRhMmIwNzJlYTY4MzA1OTUwOTMxZTFi"
//     },
//     frame: {
//       version: "1",
//       name: "mini-plant",
//       iconUrl: "https://mini-plant.vercel.app/icon.png",
//       splashImageUrl: "https://mini-plant.vercel.app/splash.png",
//       splashBackgroundColor: "#000000",
//       homeUrl: "https://mini-plant.vercel.app",
//       webhookUrl: "https://mini-plant.vercel.app/api/webhook",
//       heroImageUrl: "https://mini-plant.vercel.app/hero.png",
//       ogTitle: "mini-plant",
//       ogImageUrl: "https://mini-plant.vercel.app/hero.png"
//     }
//   });
// }

function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;
  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: withValidProperties({
      version: "1",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE,
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      screenshotUrls: [],
      iconUrl: process.env.NEXT_PUBLIC_APP_ICON,
      splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY,
      tags: [],
      heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
      ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE,
    }),
  });
}

