import { redirect } from "next/navigation";

export default async function SessionsPage() {
	redirect("/profile");
}
