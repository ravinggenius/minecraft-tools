export const BORDER_STYLES = ["none", "thin", "thick"] as const;
export type BorderStyle = (typeof BORDER_STYLES)[number];

export const RADIUS_STYLES = ["none", "sharp", "dull"] as const;
export type RadiusStyle = (typeof RADIUS_STYLES)[number];

export const SHADOW_STYLES = ["low", "high"] as const;
export type ShadowStyle = (typeof SHADOW_STYLES)[number];
