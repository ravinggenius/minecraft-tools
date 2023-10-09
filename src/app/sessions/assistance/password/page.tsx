import { redirect } from "next/navigation";

export default async function SessionAssistancePasswordPage() {
	redirect("/sessions/new");
}
