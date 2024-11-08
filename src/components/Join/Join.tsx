import { Children, Fragment, ReactNode } from "react";

export default function Join({
	children,
	glue
}: {
	children: ReactNode | Array<ReactNode>;
	glue: ReactNode;
}) {
	return Children.map(children, (child, index) => (
		<Fragment key={index}>
			{child}
			{index < Children.count(children) - 1 ? glue : null}
		</Fragment>
	));
}
