import nodemailer, { SendMailOptions } from "nodemailer";

import * as config from "../config-service/service";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

const transporter = nodemailer.createTransport({
	auth: {
		user: config.email.auth.username,
		pass: config.email.auth.password
	},
	host: config.email.host,
	port: config.email.port,
	secure: config.email.secure
});

export const send = async (
	fromName: string,
	to: NonNullable<SendMailOptions["to"]>,
	subject: NonNullable<SendMailOptions["subject"]>,
	body: {
		text: NonNullable<SendMailOptions["text"]>;
		html?: SendMailOptions["html"];
	}
) =>
	transporter.sendMail({
		from: { ...config.email.from, name: fromName },
		to,
		subject,
		...body
	});
