import { redirect } from "next/navigation";

export default async function TutorsDirectory({ searchParams }) {
  const params = await searchParams;
  const queryString = new URLSearchParams(params).toString();
  redirect(`/search?${queryString}`);
}
