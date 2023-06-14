import { pick } from "rambda";

export const ERROR_CODE = {
	UNIQUE_CONTRAINT_VIOLATION: "unique-contraint-violation"
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

export type UniqueConstraintPath = string | Array<string>;

export type UniqueConstraint = [
	"unique-contraint-violation",
	UniqueConstraintPath
];

export interface CodedErrorOptions<TData> {
	data: TData;
}

export interface CodedErrorAttrs<TCode extends ErrorCode, TData>
	extends CodedErrorOptions<TData> {
	code: TCode;
	name: "CodedError";
}

class CodedError<TCode extends ErrorCode, TData> extends Error {
	data: TData;

	constructor(code: TCode, { data, ...rest }: CodedErrorOptions<TData>) {
		super(code, rest);

		this.name = "CodedError";
		this.data = data;
	}

	get code() {
		return this.message as TCode;
	}

	toJsonAlt(): CodedErrorAttrs<TCode, TData> {
		// @ts-ignore not a real error
		return pick(["code", "data", "name"], this);
	}
}

export default CodedError;
