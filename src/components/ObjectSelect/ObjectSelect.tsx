import classNames from "classnames";
import { ChangeEvent, ReactNode, SelectHTMLAttributes } from "react";

import { Identity } from "@/services/datastore-service/schema";

import styles from "./ObjectSelect.module.scss";

export type Option = Identity;

export default function ObjectSelect<TOption extends Option>({
	children,
	className,
	includeBlank = false,
	onChange,
	options,
	serialize,
	...selectProps
}: {
	children: (option: TOption) => ReactNode;
	className?: string;
	includeBlank?: boolean;
	name: NonNullable<SelectHTMLAttributes<HTMLSelectElement>["name"]>;
	onChange: (optionId: TOption["id"] | undefined) => void;
	options: ReadonlyArray<TOption>;
	serialize: (option: TOption) => TOption["id"];
	value: TOption["id"] | undefined;
} & Omit<
	SelectHTMLAttributes<HTMLSelectElement>,
	"children" | "name" | "onChange" | "value"
>) {
	const handleChange = ({
		target: { value: optionId }
	}: ChangeEvent<HTMLSelectElement>) => {
		onChange(optionId);
	};

	return (
		<select
			{...selectProps}
			className={classNames(styles.select, className)}
			onChange={handleChange}
		>
			{includeBlank ? <option /> : null}

			{options.map((option) => (
				<option key={serialize(option)} value={serialize(option)}>
					{children(option)}
				</option>
			))}
		</select>
	);
}
