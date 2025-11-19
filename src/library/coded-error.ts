export const ERROR_CODE = {
	CONFIRMATION_MISMATCH: "confirmation-mismatch",
	CREDENTIALS_INVALID: "credentials-invalid",
	DUPLICATE_ENTRY: "duplicate-entry",
	SEARCH_QUERY_INVALID: "invalid-search-query",
	UNKNOWN: "unknown"
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

export type UniqueConstraintPath = string | Array<string>;

export type UniqueConstraint = [
	"unique-contraint-violation",
	UniqueConstraintPath
];

export interface CodedErrorOptions {
	cause?: Error;
	path?: Array<string | number>;
}

export interface CodedErrorAttrs extends CodedErrorOptions {
	code: ErrorCode;
	name: "CodedError";
}

class CodedError extends Error {
	code: ErrorCode;

	path: CodedErrorOptions["path"];

	constructor(code: ErrorCode, { path, ...rest }: CodedErrorOptions = {}) {
		super(code, rest);

		this.name = "CodedError";
		this.code = code;
		this.path = path;
	}

	toJson() {
		return {
			code: this.code,
			name: this.name,
			path: this.path
		};
	}
}

export default CodedError;
