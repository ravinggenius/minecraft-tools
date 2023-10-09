import { redirect } from "next/navigation";

export default async function SessionAssistancePage() {
	redirect("/sessions/new");
}
