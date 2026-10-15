import { withAlpha } from "@fovea/colorlab";
import { role, type Variant } from "@fovea/palette";
import { style } from "./html.ts";

/** A variant's colors as CSS custom properties, so the page chrome is drawn in that variant. */
export const themeVars = (v: Variant): string =>
  style({
    "color-scheme": v.polarity,
    "--page": v.neutral["bg.sunken"],
    "--panel": v.neutral.bg,
    "--raised": v.neutral["bg.raised"],
    "--hover": v.neutral["bg.overlay"],
    "--border": v.neutral.border,
    "--border-strong": v.neutral["border.strong"],
    "--faint": v.neutral["fg.faint"],
    "--muted": v.neutral["fg.muted"],
    "--subtle": v.neutral["fg.subtle"],
    "--fg": v.neutral.fg,
    "--strong": v.neutral["fg.strong"],
    "--link": role(v, "link"),
    "--ok": role(v, "success"),
    "--bad": role(v, "error"),
    "--shadow":
      v.polarity === "light"
        ? withAlpha(v.neutral["fg.strong"], 0.12)
        : withAlpha(v.neutral["bg.sunken"], 0.7),
  });

export const STYLES = `
*{box-sizing:border-box}
html{background:var(--page);color:var(--fg)}
body{margin:0;font:15px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
main{max-width:1280px;margin:0 auto;padding:36px 48px 112px}
a{color:var(--link);text-underline-offset:3px;text-decoration-thickness:1px}
code,.mono,.code{font-family:ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace}
code{font-size:.92em}
h1{font-size:40px;line-height:1.1;margin:0;color:var(--strong);font-weight:650;letter-spacing:-.02em}
h2{font-size:22px;line-height:1.25;margin:0;color:var(--strong);font-weight:620;letter-spacing:-.01em}
h3{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600;margin:36px 0 12px}
sub{font-size:.7em}
section{margin-top:80px}
.section-head{margin-bottom:22px;max-width:80ch}
.section-head p{margin:8px 0 0;color:var(--subtle)}
.topnav{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 20px;font-size:13.5px;margin-bottom:40px;padding-bottom:16px;border-bottom:1px solid var(--border)}
.topnav a{color:var(--subtle);text-decoration:none}
.topnav a:hover{color:var(--strong)}
.topnav a[aria-current]{color:var(--strong);font-weight:600}
.topnav .sep{flex:1}
.topnav .brand{font-weight:650;color:var(--strong);margin-right:8px}
.hero{margin-top:0;display:grid;gap:12px}
.hero .desc{color:var(--subtle);max-width:72ch;margin:0;font-size:16.5px}
.pill{display:inline-block;font-size:12.5px;font-weight:500;letter-spacing:.02em;padding:3px 11px;border-radius:999px;border:1px solid var(--border-strong);color:var(--subtle);vertical-align:middle;margin-left:14px;position:relative;top:-4px}
.facts{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1px;background:var(--border);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin:24px 0 0}
.facts div{background:var(--panel);padding:14px 18px}
.facts dt{font-size:12px;color:var(--muted)}
.facts dd{margin:4px 0 0;font-variant-numeric:tabular-nums}
.dot{display:inline-block;width:12px;height:12px;border-radius:4px;margin-right:8px;vertical-align:-1px;box-shadow:0 0 0 1px var(--border-strong)}
.status{list-style:none;padding:0;margin:14px 0 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:6px 28px;font-size:14px;color:var(--subtle)}
.mark{display:inline-block;width:1.5em;font-weight:700}
.mark.ok{color:var(--ok)}
.mark.bad{color:var(--bad)}
.ramp{display:grid;grid-template-columns:repeat(11,minmax(0,1fr));border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px var(--border)}
.ramp div{min-height:210px;padding:12px 9px;display:flex;flex-direction:column;justify-content:flex-end;gap:1px;font-size:11px;line-height:1.4;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
.ramp b{font-size:12px;font-weight:620;margin-bottom:2px}
.ramp .use{opacity:.8;margin-bottom:6px}
.ramp code{font-size:11px}
.chips{display:grid;grid-template-columns:repeat(auto-fill,minmax(186px,1fr));gap:12px}
.chip{margin:0;background:var(--panel);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.chip .sample{padding:20px 16px 8px;font-size:20px;white-space:nowrap;overflow:hidden;text-overflow:clip}
.chip figcaption{padding:6px 16px 14px;font-size:12px;line-height:1.55;color:var(--subtle);font-variant-numeric:tabular-nums}
.chip figcaption b{display:block;color:var(--fg);font-size:13.5px;font-weight:620;margin-bottom:1px}
.ansi-grid{grid-template-columns:repeat(8,minmax(0,1fr))}
.chip.ansi .fill{height:44px}
.chip.ansi .sample{font-size:15px;padding:12px 14px 4px}
.chip.ansi figcaption{padding:4px 14px 12px;font-size:11.5px}
.chip.ansi figcaption b{display:inline;margin-right:8px}
.overlays{grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
.chip.overlay .sample{font-size:14px;padding:16px;margin:12px 12px 0;border-radius:8px}
.table{border-collapse:separate;border-spacing:0;width:100%;font-size:13px;font-variant-numeric:tabular-nums;background:var(--panel);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.table th,.table td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--border);vertical-align:middle}
.table tbody tr:last-child>*{border-bottom:0}
.table thead th{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;background:var(--raised)}
.table tbody th{font-weight:500}
.table .num{text-align:right}
.table small{display:block;color:var(--muted);font-size:11px;line-height:1.45;margin-top:4px}
.accents th b{display:block;font-weight:620;color:var(--strong)}
.accents td{min-width:150px}
.word{font-size:16px}
.squiggle{text-decoration-line:underline;text-decoration-style:wavy;text-decoration-thickness:1.5px;text-underline-offset:4px}
.bar{display:inline-block;width:4px;height:18px;border-radius:2px;margin-left:12px;vertical-align:-3px}
.tint{display:inline-block;padding:3px 10px;border-radius:6px;font-size:14px}
.matrix{border-collapse:separate;border-spacing:3px;font-size:10.5px;font-variant-numeric:tabular-nums;margin-left:-3px}
.matrix th{font-weight:500;color:var(--subtle);text-align:right;padding:0 10px 0 0;white-space:nowrap;font-size:12px}
.matrix thead th{text-align:center;padding:0 0 6px;font-size:11.5px}
.matrix td{width:78px;height:48px;border-radius:8px;text-align:center;line-height:1.25;box-shadow:inset 0 0 0 1px var(--border);position:relative}
.matrix td b{display:block;font-size:16px;font-weight:500}
.matrix td.fail{box-shadow:inset 0 0 0 2px var(--bad)}
.matrix td.fail::after{content:"✕";position:absolute;top:3px;right:6px;font-size:10px;color:var(--bad)}
.panel{margin:0;background:var(--panel);border:1px solid var(--border);border-radius:14px;overflow:hidden;min-width:0}
.panel-title{display:flex;justify-content:space-between;gap:12px;font-size:12px;padding:8px 16px;color:var(--muted);border-bottom:1px solid var(--border);background:var(--raised)}
.code{margin:0;padding:12px 0;font-size:13px;line-height:1.6;white-space:pre;overflow:hidden;tab-size:4}
.terminal .code{tab-size:8;padding:12px 16px}
.ln{display:flex;min-height:1.6em}
.no{flex:none;padding:0 20px 0 16px;text-align:right;user-select:none}
.gut{flex:none;width:16px;padding-left:4px;user-select:none}
.tx{flex:1;padding-right:16px}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
.wide{grid-column:1/-1}
.editor{position:relative;border:1px solid;border-radius:14px;overflow:hidden;box-shadow:0 12px 32px var(--shadow)}
.tabs{display:flex;font-size:12.5px;border-bottom:1px solid}
.tab{padding:10px 18px;border-right:1px solid}
.editor-body{position:relative}
.editor .code{padding:10px 0 14px;font-size:13.5px}
.find{position:absolute;top:8px;right:20px;z-index:1;display:flex;align-items:center;gap:10px;padding:6px 10px;border:1px solid;border-radius:8px;font-size:12.5px;box-shadow:0 6px 18px var(--shadow)}
.find .input{min-width:190px;padding:3px 8px;border-radius:5px;font-family:ui-monospace,"SF Mono",Menlo,monospace}
.statusbar{display:flex;gap:18px;font-size:12px;padding:5px 16px;border-top:1px solid}
.statusbar .spacer{flex:1}
.strips{display:grid;gap:6px}
.strip{display:flex;gap:22px;align-items:baseline;padding:12px 18px;border-radius:10px;font-size:14px;box-shadow:inset 0 0 0 1px var(--border)}
.strip-label{width:170px;flex:none;font-family:ui-sans-serif,system-ui,sans-serif;font-size:12px}
.pair{display:inline-flex;border-radius:6px;overflow:hidden;box-shadow:0 0 0 1px var(--border);vertical-align:middle}
.pair i{display:block;width:24px;height:20px}
.pairs td small{display:inline;margin:0 0 0 8px}
.look{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:16px;align-items:start}
.look .code{font-size:12px}
.stack{display:grid;gap:16px}
main.wide-page{max-width:1600px}
.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:28px}
.card{background:var(--page);color:var(--fg);border-radius:18px;padding:22px;display:grid;gap:14px;align-content:start;box-shadow:0 0 0 1px var(--border)}
.card h2 a{color:var(--strong);text-decoration:none}
.card p{margin:0;color:var(--subtle);font-size:13.5px}
.card .code{font-size:12px}
.card .facts{margin:0;grid-template-columns:1fr 1fr}
.card .facts div{padding:10px 14px}
`;
