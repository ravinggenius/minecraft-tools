import classNames from "classnames";

import styles from "./FeedbackList.module.css";

export interface Feedback {
	message: string;
	type: "positive" | "neutral" | "negative" | "pass" | "fail";
}

export default function FeedbackList({
	className,
	feedback
}: {
	className?: string;
	feedback: Array<Feedback>;
}) {
	return feedback.length ? (
		<ol className={classNames(styles.list, className)}>
			{feedback.map(({ message, type }) => (
				<li
					className={styles["list-item"]}
					data-type={type}
					key={message}
				>
					{message}
				</li>
			))}
		</ol>
	) : null;
}
