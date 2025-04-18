import { cookies } from "next/headers";
export async function getCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  return token || null;
}
