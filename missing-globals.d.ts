// Global utility types that TypeScript should ideally implement

declare type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
