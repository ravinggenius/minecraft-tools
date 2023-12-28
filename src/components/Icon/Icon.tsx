import { always, cond, equals } from "rambda";

export default function Icon({ code }: { code: "box" | "cross" }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
		>
			{cond([
				[equals("box"), always(<path d="M3 3L18 3L18 18L3 18L3 3" />)],
				[equals("cross"), always(<path d="M18 6 6 18M6 6l12 12" />)]
			])(code)}
		</svg>
	);
}
