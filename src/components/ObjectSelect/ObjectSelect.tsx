import classNames from "classnames";
import {
	ChangeEvent,
	FocusEventHandler,
	ReactNode,
	SelectHTMLAttributes
} from "react";

import { Identity } from "@/services/datastore-service/schema";

import styles from "./ObjectSelect.module.scss";

export type Option = Identity;

export default function ObjectSelect<TOption extends Option>({
	children,
	className,
	includeBlank = false,
	name,
	onChange,
	onFocus, // Added onFocus
	onBlur, // Added onBlur
	options,
	serialize,
	value,
	...selectProps // Spread other native select props
}: {
	children: (option: TOption) => ReactNode;
	className?: string;
	includeBlank?: boolean;
	name: NonNullable<SelectHTMLAttributes<HTMLSelectElement>["name"]>;
	onChange: (option: TOption | undefined) => void;
	onFocus?: FocusEventHandler<HTMLSelectElement>; // Added onFocus prop type
	onBlur?: FocusEventHandler<HTMLSelectElement>; // Added onBlur prop type
	options: Array<TOption>;
	serialize: (option: TOption) => TOption["id"];
	value: TOption | undefined;
} & Omit<
	SelectHTMLAttributes<HTMLSelectElement>,
	"value" | "onChange" | "name"
>) {
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
			{...selectProps} // Spread other native props
			name={name}
			className={classNames(styles.select, className)}
			onChange={handleChange}
			onFocus={onFocus} // Pass through onFocus
			onBlur={onBlur} // Pass through onBlur
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
