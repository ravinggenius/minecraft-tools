export default function Icon({
	className,
	code,
	...props
}: {
	["aria-label"]?: string;
	className: string;
	code: "box" | "cross";
}) {
	return (
		<svg
			{...props}
			{...{ className }}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
		>
			{code === "box" ? <path d="M3 3L18 3L18 18L3 18L3 3" /> : null}

			{code === "cross" ? <path d="M18 6 6 18M6 6l12 12" /> : null}
		</svg>
	);
}
