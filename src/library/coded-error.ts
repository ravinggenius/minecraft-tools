import { pick } from "rambda";

export const ERROR_CODE = {
	CONFIRMATION_MISMATCH: "confirmation-mismatch",
	CREDENTIALS_INVALID: "credentials-invalid",
	DUPLICATE_ENTRY: "duplicate-entry",
	UNKNOWN: "unknown"
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

export type UniqueConstraintPath = string | Array<string>;

export type UniqueConstraint = [
	"unique-contraint-violation",
	UniqueConstraintPath
];

export interface CodedErrorOptions {
	path?: Array<string | number>;
}

export interface CodedErrorAttrs extends CodedErrorOptions {
	code: ErrorCode;
	name: "CodedError";
}

class CodedError extends Error {
	path: CodedErrorOptions["path"];

	constructor(code: ErrorCode, { path, ...rest }: CodedErrorOptions = {}) {
		super(code, rest);

		this.name = "CodedError";
		this.path = path;
	}

	get code() {
		return this.message as ErrorCode;
	}

	toJson(): CodedErrorAttrs {
		// @ts-ignore not a real error
		return pick(["code", "name", "path"], this);
	}
}

export default CodedError;
