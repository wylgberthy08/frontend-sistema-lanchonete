import styles from "./page.module.scss";
import logoImg from "../../../public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../service/api";
import { redirect } from "next/navigation";
export default function SignUp() {
  async function handleSignUp(data: FormData) {
    "use server";
    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");

    if (name == "" || email == "" || password == "") {
      console.log("Preencha todos os campos");
      return;
    }

    try {
      const response = await api.post("/users", {
        name,
        email,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.log("Erro", error);
    }
    redirect("/");
  }
  return (
    <>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="logo" />

        <section className={styles.login}>
          <h1>Criando sua conta</h1>
          <form action={handleSignUp}>
            <input
              type="text"
              placeholder="Digite seu nome"
              required
              name="name"
              className={styles.input}
            />
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
              Cadastrar
            </button>
          </form>
          <Link href="/" className={styles.text}>
            Já possui uma conta? faça o login
          </Link>
        </section>
      </div>
    </>
  );
}
