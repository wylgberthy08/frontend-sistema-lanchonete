"use client";

import { UploadCloud } from "lucide-react";
import styles from "./styles.module.scss";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/app/dashboard/components/button";
import { api } from "@/service/api";
import { getCookieClient } from "@/lib/cookieClient";
import {toast} from 'sonner'
import { useRouter } from "next/navigation";

interface CategoryProps {
  id: string;
  name: string;
}

interface Props {
  categories: CategoryProps[];
}

export function Form({ categories }: Props) {
  const router = useRouter();
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>("");

  async function handleRegisterProduct(formData: FormData) {
    const categoryIndex = formData.get("category")?.toString();
    const name = formData.get("name")?.toString();
    const price = formData.get("price")?.toString();
    const description = formData.get("description")?.toString();

    if (!name || !price || !description || !image) {
      toast.warning("Preencha todos os campos.");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("description", description);
    data.append("category_id", categories[Number(categoryIndex)].id);
    data.append("file", image);

    const token = getCookieClient();

    await api
      .post("/product", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
       toast.warning("Erro ao cadastrar o produto.");
      });

    toast.success("Produto cadastrado com sucesso!")
    router.push("/dashboard/product");
    
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];

      if (image.type !== "image/png" && image.type !== "image/jpeg") {
        toast.warning("Tipo de arquivo inválido. Aceitamos apenas PNG e JPEG.");
        return;
      }
      setImage(image);
      setPreview(URL.createObjectURL(image));
      console.log(image);
    }
  }

  return (
    <main className={styles.container}>
      <h1>Novo Produto</h1>
      <form className={styles.form} action={handleRegisterProduct}>
        <label className={styles.labelImage}>
          <span>
            <UploadCloud size={30} color="#fff" />
          </span>
          <input
            type="file"
            accept="image/png, image/jpeg"
            required
            onChange={handleFile}
          />
          {preview && (
            <Image
              alt="Imagem de preview"
              src={preview}
              className={styles.preview}
              fill={true}
              quality={100}
              priority={true}
            />
          )}
        </label>

        <select name="category" className={styles.input}>
          {categories.map((category, index) => (
            <option key={category.id} value={index}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          placeholder="Digite o nome do produto..."
          required
          className={styles.input}
        />
        <input
          type="text"
          name="price"
          placeholder="Digite o preço do produto..."
          required
          className={styles.input}
        />
        <textarea
          name="description"
          placeholder="Descrição do produto..."
          required
          className={styles.input}
        />
        <Button name="Cadastrar produto" />
      </form>
    </main>
  );
}
