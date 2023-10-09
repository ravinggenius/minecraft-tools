"use server";

import bcrypt from "bcrypt";
import { addMinutes } from "date-fns";

import * as config from "@/library/_/config.mjs";

import { db, readQueries } from "../_/datastore";

import { PasswordReset } from "./schema";

const queries = readQueries("password-reset", ["create"]);

export const create = async (attrs: Pick<PasswordReset, "email" | "nonce">) =>
	db.one<PasswordReset>(queries.create, {
		...attrs,
		expiresAt: addMinutes(
			new Date(),
			config.sessionAssistancePasswordResetExpiryMinutes
		)
	});
