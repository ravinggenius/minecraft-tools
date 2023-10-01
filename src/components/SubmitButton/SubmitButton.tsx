import { experimental_useFormStatus as useFormStatus } from "react-dom";

import Button from "@/components/Button/Button";

export default function SubmitButton({ label }: { label: string }) {
	const { pending } = useFormStatus();

	return (
		<Button disabled={pending} type="submit" variant="primary">
			{label}
		</Button>
	);
}
