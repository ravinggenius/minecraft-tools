import bcrypt from "bcrypt";

import * as config from "../_/config.mjs";
import { db, readQueries } from "../_/datastore";
import CodedError, { ERROR_CODE } from "../_/errors/coded-error";

import { Account, ACCOUNT_CREATE_ATTRS, AccountCreateAttrs } from "./schema";

const queries = readQueries("account", [
	"create",
	"getByEmail",
	"validateUniqueEmail"
]);

export const create = async (attrs: AccountCreateAttrs) => {
	const {
		account: { password, passwordConfirmation, ...account },
		profile
	} = await ACCOUNT_CREATE_ATTRS.parseAsync(attrs);

	if (passwordConfirmation !== password) {
		throw new CodedError(ERROR_CODE.CONFIRMATION_MISMATCH, {
			path: ["account", "passwordConfirmation"]
		});
	}

	const hashword = await bcrypt.hash(password, config.passwordSaltRounds);

	return db.tx(async (t) => {
		const { alreadyExists } = await t.one<{ alreadyExists: boolean }>(
			queries.validateUniqueEmail,
			{
				email: account.email
			}
		);

		if (alreadyExists) {
			throw new CodedError(ERROR_CODE.DUPLICATE_ENTRY, {
				path: ["account", "email"]
			});
		}

		return t.one<Account>(queries.create, {
			account: { ...account, hashword },
			profile
		});
	});
};

export const findByEmail = async (email: Account["email"]) => {
	const maybeAccountPlusHashword = await db.oneOrNone<
		Account & {
			hashword: string;
		}
	>(queries.getByEmail, {
		email
	});

	return maybeAccountPlusHashword || undefined;
};
