import { redirect } from "next/navigation";

export const generateMetadata = () => {
	redirect("/profile");
};

export default async function SessionsPage() {
	return null;
}
