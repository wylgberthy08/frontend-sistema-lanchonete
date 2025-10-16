import { getCookie } from "@/lib/cookieServer";
import { Form } from "./components/form";
import { api } from "@/service/api";

export default async function Product() {
  const token = await getCookie();

  const response = await api.get("/category", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response.data);
  return (
    <main>
      <Form categories={response.data} />
    </main>
  );
}
