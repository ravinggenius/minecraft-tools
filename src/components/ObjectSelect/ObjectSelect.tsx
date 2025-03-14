import classNames from "classnames";
import { ChangeEvent, ReactNode, SelectHTMLAttributes } from "react";

import { Identity } from "@/services/datastore-service/schema";

import styles from "./ObjectSelect.module.scss";

export type Option = Identity;

export default function ObjectSelect<TOption extends Option>({
	children,
	className,
	includeBlank = false,
	name,
	onChange,
	options,
	serialize,
	value
}: {
	children: (option: TOption) => ReactNode;
	className?: string;
	includeBlank?: boolean;
	name: NonNullable<SelectHTMLAttributes<HTMLSelectElement>["name"]>;
	onChange: (option: TOption | undefined) => void;
	options: Array<TOption>;
	serialize: (option: TOption) => TOption["id"];
	value: TOption | undefined;
}) {
	const keyedOptions = options.reduce(
		(memo, option) => ({
			...memo,
			[serialize(option)]: option
		}),
		{} as Record<TOption["id"], TOption>
	);

	const handleChange = ({
		target: { value: optionId }
	}: ChangeEvent<HTMLSelectElement>) => {
		onChange(
			optionId ? keyedOptions[optionId as TOption["id"]] : undefined
		);
	};

	return (
		<select
			{...{ name }}
			className={classNames(styles.select, className)}
			onChange={handleChange}
			value={value ? serialize(value) : ""}
		>
			{includeBlank ? <option /> : null}

			{(
				Object.entries(keyedOptions) satisfies Array<
					[TOption["id"], TOption]
				>
			).map(([optionId, option]) => (
				<option key={optionId} value={optionId}>
					{children(option)}
				</option>
			))}
		</select>
	);
}
