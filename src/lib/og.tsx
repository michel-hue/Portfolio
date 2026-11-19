import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import tokens from "../../charte/code/tokens.json";

/*
 * Images de partage (Open Graph) aux couleurs de la charte.
 * Satori (moteur de next/og) ne lit pas les variables CSS ni le woff2 :
 * couleurs lues dans charte/code/tokens.json (thème sombre), polices en TTF.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const color = Object.fromEntries(tokens.color.tokens.map((t) => [t.name, t.value.dark])) as Record<
  string,
  string
>;

const fontsDir = join(process.cwd(), "assets", "og-fonts");
const fontsPromise = Promise.all([
  readFile(join(fontsDir, "Geist-Regular.ttf")),
  readFile(join(fontsDir, "Geist-SemiBold.ttf")),
  readFile(join(fontsDir, "GeistMono-Medium.ttf")),
]);

type OgContent = {
  /** Sur-titre en mono capitales. */
  eyebrow: string;
  /** Titre principal (le point final accent est ajouté). */
  title: string;
  /** Ligne du bas (nom · ville). */
  footer: string;
  shortName: string;
};

export async function renderOgImage({ eyebrow, title, footer, shortName }: OgContent) {
  const [regular, semibold, mono] = await fontsPromise;
  const long = title.length > 48;
  const words = title.trim().split(/\s+/);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: color.bg,
          backgroundImage: `radial-gradient(circle at 100% 0%, ${color["accent-glow"]}, transparent 55%)`,
          color: color.ink,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 600, letterSpacing: "-0.04em" }}>
            {shortName}
            <span style={{ color: color.accent }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 20,
              background: color.accent,
              color: color["on-accent"],
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: "-0.04em",
            }}
          >
            a.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: color["ink-muted"],
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 1000,
              fontSize: long ? 64 : 84,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: "-0.035em",
            }}
          >
            {/* Un mot par élément pour le retour à la ligne ; le point reste collé au dernier mot. */}
            {words.slice(0, -1).map((word, i) => (
              <span key={i} style={{ marginRight: "0.24em" }}>
                {word}
              </span>
            ))}
            <span style={{ display: "flex" }}>
              {words.at(-1)}
              <span style={{ color: color.accent }}>.</span>
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            paddingTop: 28,
            borderTop: `1px solid ${color.line}`,
            fontSize: 26,
            color: color["ink-subtle"],
          }}
        >
          {footer}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
