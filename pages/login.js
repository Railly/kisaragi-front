import { useForm } from "react-hook-form";
import TextInput from "ui/TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "ui/Button";
import { useRouter } from "next/router";
import Link from "ui/Link";
import { useState } from "react";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email es requerido"),
  password: yup.string().required("Contraseña es requerida"),
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
    formData.append("email", data.email);
    formData.append("password", data.password);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KISARAGI_USERS_API}/users/login`,
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
          Inicia sesión
        </h2>
        <div className="grid pt-4 gap-y-4">
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
          <Button type="submit" className="mt-4">
            Iniciar sesión
          </Button>
        </div>
        <div className="pt-4 text-center">
          <Link to="/">Aún no tengo una cuenta 😢</Link>
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
