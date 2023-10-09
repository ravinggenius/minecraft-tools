"use server";

import bcrypt from "bcrypt";
import { addMinutes } from "date-fns";

import * as config from "@/library/_/config.mjs";

import { db, readQueries } from "../_/datastore";
import CodedError, { ERROR_CODE } from "../_/errors/coded-error";

import {
	PASSWORD_RESET_RESET_ATTRS,
	PasswordReset,
	PasswordResetResetAttrs
} from "./schema";

const queries = readQueries("password-reset", [
	"create",
	"clear",
	"resetPassword"
]);

export const create = async (attrs: Pick<PasswordReset, "email" | "nonce">) =>
	db.one<PasswordReset>(queries.create, {
		...attrs,
		expiresAt: addMinutes(
			new Date(),
			config.sessionAssistancePasswordResetExpiryMinutes
		)
	});

export const reset = async (attrs: PasswordResetResetAttrs) => {
	const { email, nonce, password, passwordConfirmation } =
		await PASSWORD_RESET_RESET_ATTRS.parseAsync(attrs);

	if (passwordConfirmation !== password) {
		throw new CodedError(ERROR_CODE.CONFIRMATION_MISMATCH, {
			path: ["passwordConfirmation"]
		});
	}

	const hashword = await bcrypt.hash(password, config.passwordSaltRounds);

	return db.tx(async (t) => {
		const { rowCount } = await t.result(queries.resetPassword, {
			email,
			nonce,
			hashword
		});

		const success = rowCount === 1;

		if (success) {
			await db.none(queries.clear, { email, nonce });
		}

		return success;
	});
};
