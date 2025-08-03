import { AnyFieldApi } from "@tanstack/react-form";
import { FocusEventHandler, useState } from "react";

const useFocusBlur = () => {
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus: FocusEventHandler<HTMLInputElement> = () => {
		setIsFocused(true);
	};

	const makeHandleBlur =
		(field: AnyFieldApi): FocusEventHandler<HTMLInputElement> =>
		() => {
			field.handleBlur();
			setIsFocused(false);
		};

	return {
		isFocused,
		handleFocus,
		makeHandleBlur
	};
};

export default useFocusBlur;
