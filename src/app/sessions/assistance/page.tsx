import { redirect } from "next/navigation";

export const generateMetadata = () => {
	redirect("/sessions/new");
};

export default async function SessionAssistancePage() {
	return null;
}
