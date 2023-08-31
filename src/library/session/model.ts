import bcrypt from "bcrypt";
import { add } from "date-fns";

import * as config from "@/library/_/config.mjs";
import { db, readQueries } from "@/library/_/datastore";
import CodedError, { ERROR_CODE } from "@/library/_/errors/coded-error";
import * as accountModel from "@/library/account/model";
import { Account } from "@/library/account/schema";

import { Session, SessionCredentials, SESSION_CREDENTIALS } from "./schema";

const queries = readQueries("session", [
	"clearExpired",
	"create",
	"destroy",
	"verify"
]);

export const create = async (attrs: SessionCredentials) => {
	const { email, password } = await SESSION_CREDENTIALS.parseAsync(attrs);

	const maybeAccountPlusHashword = await accountModel.findByEmail(email);

	if (!maybeAccountPlusHashword) {
		throw new CodedError(ERROR_CODE.CREDENTIALS_INVALID);
	}

	const { id: accountId, hashword } = maybeAccountPlusHashword;

	if (await bcrypt.compare(password, hashword)) {
		return db.one<Session>(queries.create, {
			accountId,
			expiresAt: add(new Date(), {
				seconds: config.sessionMaxAgeSeconds
			})
		});
	} else {
		throw new CodedError(ERROR_CODE.CREDENTIALS_INVALID);
	}
};

export const verify = (sessionId: Session["id"]) =>
	db.oneOrNone<Account>(queries.verify, { sessionId });

export const destroy = (sessionId: Session["id"]) =>
	db.none(queries.destroy, { sessionId });

export const clearExpired = () => db.none(queries.clearExpired);
