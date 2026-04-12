import { redirect } from "next/navigation";

export default async function TutorRedirect({ params }) {
    const { id } = await params;
    redirect(`/search/${id}`);
}
