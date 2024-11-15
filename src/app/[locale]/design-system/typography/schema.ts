export const NAMES = [
	"primary-title",
	"secondary-title",
	"tertiary-title",
	"hero",
	"technical",
	"primary-body",
	"secondary-body",
	"label",
	"fine"
] as const;
export type Name = (typeof NAMES)[number];
