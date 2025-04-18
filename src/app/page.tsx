import styles from "./page.module.scss";
import logoImg from "../../public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { api } from "../service/api";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function Page() {
  async function handleLogin(data: FormData) {
    "use server";
    const email = data.get("email");
    const password = data.get("password");

    if (email == "" || password == "") {
      return;
    }

    try {
      const response = await api.post("/session", {
        email,
        password,
      });

      if (!response.data.token) {
        return;
      }
      const expressTime = 60 * 60 * 24 * 30 * 1000;
      const cookieStore = await cookies();

      cookieStore.set("session", response.data.token, {
        maxAge: expressTime,
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });

      console.log(response.data);
    } catch (error) {
      console.log("Erro", error);
    }
    redirect("/dashboard");
  }
  return (
    <main>
      <>
        <div className={styles.containerCenter}>
          <Image src={logoImg} alt="logo" />

          <section className={styles.login}>
            <form action={handleLogin}>
              <input
                type="email"
                placeholder="Digite seu email"
                required
                name="email"
                className={styles.input}
              />
              <input
                type="password"
                placeholder="******"
                required
                name="password"
                className={styles.input}
              />
              <button type="submit" className={styles.button}>
                Acessar
              </button>
            </form>
            <Link href="/signUp" className={styles.text}>
              Não possui uma conta? Cadastre-se
            </Link>
          </section>
        </div>
      </>
    </main>
  );
}
