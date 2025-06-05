import { getCookie } from "@/lib/cookieServer";
import { Button } from "../components/button";
import styles from "./styles.module.scss";
import { api } from "@/service/api";
import { redirect } from "next/navigation";
export default function CategoryPage() {
    async function handleRegisterCategory(formData: FormData) {
        "use server";
        const name = formData.get("name");
        if (name === "") return;

        const data = {
            name: name
        }

        const token = await getCookie()
        await api.post("/category", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch((error) => {
            console.error("Erro ao registrar categoria:", error);
            return;
        })
        redirect('/dashboard')

    }

    return (
        <main className={styles.container}>
            <h1>Nova Categoria</h1>

            <form className={styles.form} action={handleRegisterCategory}>
                <input
                    type="text"
                    name="name"
                    required
                    className={styles.input}
                    placeholder="Digite o nome da categoria"

                />
                <Button name="Cadastrar" />
            </form>
        </main>
    )
}