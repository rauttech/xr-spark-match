// src/utils/color.ts
/**
 * Interpolate between two hex colours.
 * @param hexA   Starting colour (e.g. "#FF0000")
 * @param hexB   Ending colour (e.g. "#FF7A00")
 * @param t      Normalised value 0‑1 (0 = hexA, 1 = hexB)
 * @returns      Interpolated hex colour.
 */
export function interpolateColor(hexA: string, hexB: string, t: number): string {
    const a = parseInt(hexA.slice(1), 16);
    const b = parseInt(hexB.slice(1), 16);

    const ar = (a >> 16) & 0xff;
    const ag = (a >> 8) & 0xff;
    const ab = a & 0xff;

    const br = (b >> 16) & 0xff;
    const bg = (b >> 8) & 0xff;
    const bb = b & 0xff;

    const cr = Math.round(ar + (br - ar) * t);
    const cg = Math.round(ag + (bg - ag) * t);
    const cb = Math.round(ab + (bb - ab) * t);

    return `#${((cr << 16) | (cg << 8) | cb).toString(16).padStart(6, '0')}`;
}

/**
 * Darken a hex colour by a given amount.
 * @param hex      Colour to darken (e.g. "#FF7A00")
 * @param amount   0‑1 where 0 = no change, 1 = black.
 * @returns        Darkened hex colour.
 */
export function darkenColor(hex: string, amount: number): string {
    const c = parseInt(hex.slice(1), 16);
    const r = (c >> 16) & 0xff;
    const g = (c >> 8) & 0xff;
    const b = c & 0xff;

    const dr = Math.max(0, Math.min(255, Math.round(r * (1 - amount))));
    const dg = Math.max(0, Math.min(255, Math.round(g * (1 - amount))));
    const db = Math.max(0, Math.min(255, Math.round(b * (1 - amount))));

    return `#${((dr << 16) | (dg << 8) | db).toString(16).padStart(6, '0')}`;
}

/**
 * Get the final colour for a match percentage.
 * The function first selects the correct band, interpolates between the band
 * start/end colours, then applies a subtle darkening (up to 25 %) that grows
 * as the value approaches the upper bound of the band.
 * @param percent 0‑100 match percentage.
 * @returns Hex colour string.
 */
export function getMatchColor(percent: number): string {
    const p = Math.max(0, Math.min(100, percent));

    // 0‑50% (Red → Orange)
    if (p <= 50) {
        const t = p / 50;
        return interpolateColor('#FF0000', '#FF7A00', t);
    }

    // 50‑65% (Orange → Yellow)
    if (p <= 65) {
        const t = (p - 50) / 15;
        return interpolateColor('#FF7A00', '#FFE100', t);
    }

    // 65‑75% (Yellow → Light Green)
    if (p <= 75) {
        const t = (p - 65) / 10;
        return interpolateColor('#FFE100', '#A8FF5A', t);
    }

    // 75‑100% (Light Green → Dark Green)
    const t = (p - 75) / 25;
    return interpolateColor('#A8FF5A', '#00B700', t);
}

/** Debug helper – generate a colour map for a set of sample percentages. */
export function previewMatchColors(samples: number[]): Record<number, string> {
    const map: Record<number, string> = {};
    for (const s of samples) {
        map[s] = getMatchColor(s);
    }
    return map;
}
