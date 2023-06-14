import bcrypt from "bcrypt";
import { add } from "date-fns";

import * as config from "../_/config.mjs";
import { db, readQueries } from "../_/datastore";
import * as accountModel from "../account/model";
import { Account } from "../account/schema";

import { Session, SessionCredentials, SESSION_CREDENTIALS } from "./schema";

const queries = readQueries("session", ["create", "destroy", "verify"]);

export const create = async (attrs: SessionCredentials) => {
	const { email, password } = await SESSION_CREDENTIALS.parseAsync(attrs);

	const maybeAccountPlusHashword = await accountModel.findByEmail(email);

	if (!maybeAccountPlusHashword) {
		throw new Error("invalid-account-credentials");
	}

	const { id: accountId, hashword } = maybeAccountPlusHashword;

	if (await bcrypt.compare(password, hashword)) {
		return db.one<Session>(queries.create, {
			accountId,
			expiresAt: add(new Date(), {
				seconds: config.sessionCookie.maxAgeSeconds
			})
		});
	} else {
		throw new Error("invalid-account-credentials");
	}
};

export const verify = (sessionId: Session["id"]) =>
	db.one<Account>(queries.verify, { sessionId });

export const destroy = (sessionId: Session["id"]) =>
	db.none(queries.destroy, { sessionId });
