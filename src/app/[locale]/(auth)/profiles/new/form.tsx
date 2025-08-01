"use client";

import { useForm } from "@tanstack/react-form";

import Form from "@/components/Form/Form";
import TextField from "@/components/TextField/TextField";
import { ACCOUNT_CREATE_ATTRS } from "@/domains/account/schema";
import { useTranslation } from "@/i18n/client";
import { ServerAction } from "@/library/server-action";

import styles from "./form.module.scss";

export default function CreateProfileForm({
	action: createProfile
}: {
	action: ServerAction;
}) {
	const { t } = useTranslation("page-component-new-profile-form");

	const form = useForm({
		defaultValues: {
			profile: {
				name: ""
			},
			account: {
				email: "",
				password: "",
				passwordConfirmation: ""
			}
		},
		validators: {
			onSubmit: ACCOUNT_CREATE_ATTRS
		}
	});

	// Create a wrapper action that works with the existing Form component
	const handleSubmit: ServerAction = async (data) => {
		// The data is already FormData, so we can pass it directly
		return await createProfile(data);
	};

	return (
		<Form
			action={handleSubmit}
			className={styles.form}
			submitLabel={t("submit")}
			feedback={[]}
		>
			<TextField
				name="profile.name"
				value={form.state.values.profile.name}
				onChange={(e) =>
					form.setFieldValue("profile.name", e.target.value)
				}
				label={t("name.label")}
				required
				id="profile-name"
				meta={{ dirty: false, focus: false }}
				// feedback={
				// 	form.state.fieldMeta.profile?.name?.errors?.map(
				// 		(error) => ({
				// 			type: "negative" as const,
				// 			message: error
				// 		})
				// 	) || []
				// }
			/>

			<TextField
				name="account.email"
				value={form.state.values.account.email}
				onChange={(e) =>
					form.setFieldValue("account.email", e.target.value)
				}
				label={t("email.label")}
				required
				type="email"
				id="account-email"
				meta={{ dirty: false, focus: false }}
				// feedback={
				// 	form.state.fieldMeta.account?.email?.errors?.map(
				// 		(error) => ({
				// 			type: "negative" as const,
				// 			message: error
				// 		})
				// 	) || []
				// }
			/>

			<TextField
				name="account.password"
				value={form.state.values.account.password}
				onChange={(e) =>
					form.setFieldValue("account.password", e.target.value)
				}
				label={t("password.label")}
				required
				type="password"
				id="account-password"
				meta={{ dirty: false, focus: false }}
				// feedback={
				// 	form.state.fieldMeta.account?.password?.errors?.map(
				// 		(error) => ({
				// 			type: "negative" as const,
				// 			message: error
				// 		})
				// 	) || []
				// }
			/>

			<TextField
				name="account.passwordConfirmation"
				value={form.state.values.account.passwordConfirmation}
				onChange={(e) =>
					form.setFieldValue(
						"account.passwordConfirmation",
						e.target.value
					)
				}
				label={t("password-confirmation.label")}
				required
				type="password"
				id="account-password-confirmation"
				meta={{ dirty: false, focus: false }}
				// feedback={
				// 	form.state.fieldMeta.account?.passwordConfirmation?.errors?.map(
				// 		(error) => ({
				// 			type: "negative" as const,
				// 			message: error
				// 		})
				// 	) || []
				// }
			/>
		</Form>
	);
}
