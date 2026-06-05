// _data/themes.js
// Exact branding per site so each blog page matches its storefront,
// plus the correct "← Back" target for each.
//
// backUrl logic:
//  - onlinefinds is the main hub -> back goes to the main store (rixsto.in)
//  - the other four are their own subdomains -> back goes to "/" (their storefront root)

module.exports = {
  onlinefinds: {
    accent:"#EB5030", brand:"#0A3524", bg:"#f7f7f7", card:"#ffffff",
    border:"#eaeaea", text:"#222222", soft:"#555555",
    backUrl:"https://rixsto.in", backLabel:"RIXSTO"
  },
  dailyloot: {
    accent:"#ff5a5f", brand:"#ffb84d", bg:"#09090b", card:"#111111",
    border:"#3a1f1f", text:"#f8fafc", soft:"#cfcfd4",
    backUrl:"/", backLabel:"@dailyloot.co"
  },
  justoneclick: {
    accent:"#8b7355", brand:"#ffb84d", bg:"#f7f2eb", card:"#fffdf9",
    border:"#d8cec3", text:"#3d352e", soft:"#6b5b4d",
    backUrl:"/", backLabel:"@just.one_click.co"
  },
  phaseblank: {
    accent:"#6f8fb3", brand:"#9fb8d4", bg:"#0b1220", card:"#111827",
    border:"#263547", text:"#e5edf7", soft:"#cdd9e8",
    backUrl:"/", backLabel:"@phase.blank"
  },
  cartedupdaily: {
    accent:"#f97316", brand:"#0284c7", bg:"#f8fafc", card:"#ffffff",
    border:"#dbeafe", text:"#222222", soft:"#475569",
    backUrl:"/", backLabel:"@cartedupdaily"
  }
};
