// Universal links: belltower.bymanu.me/i/<code> opens the app instead of Safari when it's installed.
const APP_IDS = ['78H2VSK889.me.bymanu.belltower', '78H2VSK889.me.bymanu.belltower.dev'];

export const dynamic = 'force-static';

export function GET() {
  return Response.json({
    applinks: { details: [{ appIDs: APP_IDS, components: [{ '/': '/i/*', comment: 'Friend invites' }] }] },
    webcredentials: { apps: APP_IDS },
  });
}
