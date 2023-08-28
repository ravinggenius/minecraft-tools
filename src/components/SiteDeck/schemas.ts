interface ResourceWithChildren {
	children: Array<Resource>;
	href: string;
	title: string;
	description?: string;
}

interface ResourceWithoutChildren {
	children?: Array<never>;
	href: string;
	title: string;
	description?: string;
}

export type Resource = ResourceWithChildren | ResourceWithoutChildren;
