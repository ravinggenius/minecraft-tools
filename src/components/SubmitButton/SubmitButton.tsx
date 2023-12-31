import classNames from "classnames";
import { ComponentProps } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

import Button from "@/components/Button/Button";

import styles from "./SubmitButton.module.css";

export default function SubmitButton({
	className,
	label,
	variant = "primary"
}: Partial<Pick<ComponentProps<typeof Button>, "className" | "variant">> & {
	label: ComponentProps<typeof Button>["children"];
}) {
	const { pending } = useFormStatus();

	return (
		<Button
			{...{ variant }}
			className={classNames(styles.button, className)}
			disabled={pending}
			type="submit"
		>
			{label}
		</Button>
	);
}
