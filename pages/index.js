import { useForm } from "react-hook-form";
import TextInput from "ui/TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FileInput from "ui/FileInput";
import Button from "ui/Button";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "ui/Link";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Nombre es requerido")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(40, "Debe tener máximo 40 caracteres"),
  email: yup.string().email("Email inválido").required("Email es requerido"),
  password: yup
    .string()
    .required("Contraseña es requerida")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y debe tener al menos 8 caracteres"
    ),
  file: yup
    .mixed()
    .test(
      "file",
      "Archivo inválido",
      (value) =>
        value?.[0] &&
        (value?.[0].type === "image/png" || value.type === "image/jpeg")
    ),
});

const errorDictionary = {
  "User not found": "Usuario no encontrado",
  "Invalid password": "Contraseña incorrecta",
};

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    console.log(data);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("file", data.file[0]);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KISARAGI_USERS_API}/users`,
      {
        method: "POST",
        body: formData,
      }
    );
    const json = await res.json();
    console.log(json);
    if (json.ok) {
      window.localStorage.setItem("token", JSON.stringify(json.token));
      window.localStorage.setItem("user", JSON.stringify(json.user));
      router.push("/app");
    } else {
      setError(json.error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen min-h-screen bg-blue-500">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl px-8 py-6 bg-white rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center text-slate-700">
          Bienvenido a Kisaragi
        </h1>
        <h2 className="pt-4 text-lg font-medium text-center text-slate-700">
          Regístrate para empezar
        </h2>
        <div className="grid pt-4 gap-y-4">
          <TextInput
            label="Nombre"
            name="name"
            disabled={false}
            register={register}
            errors={errors.name}
          />
          <TextInput
            label="Correo electrónico"
            name="email"
            disabled={false}
            register={register}
            errors={errors.email}
          />
          <TextInput
            label="Contraseña"
            type="password"
            name="password"
            disabled={false}
            register={register}
            errors={errors.password}
          />
          <FileInput
            label="Foto de perfil"
            name="file"
            disabled={false}
            errors={errors.file}
            {...register("file")}
          />
          <Button type="submit">Registrarme</Button>
        </div>
        <div className="pt-4 text-center">
          <Link to="/login">Ya tengo una cuenta 😊</Link>
        </div>
        {error && (
          <p className="px-4 py-2 mt-4 text-sm font-semibold text-center text-white bg-rose-500">
            {errorDictionary[error]}
          </p>
        )}
      </form>
    </main>
  );
}
