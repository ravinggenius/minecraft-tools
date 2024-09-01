export const HUES = ["neutral", "red", "green", "blue", "yellow"] as const;
export type Hue = (typeof HUES)[number];

export const LIGHTNESSES = [
	50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
] as const;
export type Lightness = (typeof LIGHTNESSES)[number];
