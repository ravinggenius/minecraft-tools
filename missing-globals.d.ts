// Global utility types that TypeScript should ideally implement

declare type BooleanOnly<T> = {
	[K in keyof T as T[K] extends boolean ? K : never]: T[K];
};

declare type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
