import { yupResolver } from "@hookform/resolvers/yup";
import useDelete from "hooks/useDelete";
import useGetOne from "hooks/useGetOne";
import useUpdate from "hooks/useUpdate";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "ui/Button";
import FileInput from "ui/FileInput";
import SpinnerIcon from "ui/Icons/SpinnerIcon";
import TextInput from "ui/TextInput";
import * as yup from "yup";

const schema = yup.object().shape({
  description: yup.string(),
  file: yup.mixed(),
});

export default function EditProfile() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [user, setUser] = useState(null);
  const currentUser = useGetOne("users", user?.userId);
  const handleUpdate = useUpdate("users");
  const handleDelete = useDelete("users");
  console.log(currentUser, "currentUser");

  const onSubmit = async (data) => {
    console.log(data);
    const formData = new FormData();
    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
    }
    if (data.description) {
      formData.append("description", data.description);
    }
    await handleUpdate(formData);
    currentUser.refetch();
  };

  useEffect(() => {
    const parsedUser = JSON.parse(window.localStorage.getItem("user"));
    setUser(parsedUser);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setValue("description", currentUser?.data?.user?.description);
    }
  }, [currentUser, setValue]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-8">
      <div className="flex justify-center w-full">
        {!currentUser?.data?.user ? (
          <SpinnerIcon className="w-10 h-10 mr-3 -ml-1 text-blue-500 animate-spin" />
        ) : (
          <section className="flex flex-col items-center justify-center flex-1 max-w-lg px-4 py-8 bg-white shadow-lg">
            <h1 className="mb-4 text-2xl font-bold">Tu perfil</h1>
            <div className="flex items-center justify-center w-full my-4">
              <Image
                className="rounded-full"
                src={currentUser?.data?.user?.profileImage}
                alt={`Foto de perfil de ${currentUser?.data?.user?.name}`}
                width={100}
                height={100}
              />
              <div className="mt-4 ml-6">
                <h2 className="text-xl font-bold">
                  {currentUser?.data?.user?.name}
                </h2>
                <p className="text-sm">{currentUser?.data?.user?.email}</p>
                {/* Format createdAt */}
                <p className="text-sm">
                  Se unió hace{" "}
                  {new Date() -
                    new Date(currentUser?.data?.user?.createdAt) /
                      (1000 * 60 * 60 * 24) <
                  1
                    ? `${Math.round(
                        (new Date() -
                          new Date(currentUser?.data?.user?.createdAt)) /
                          (1000 * 60)
                      )} minutos`
                    : `${Math.round(
                        (new Date() -
                          new Date(currentUser?.data?.user?.createdAt)) /
                          (1000 * 60 * 60)
                      )} horas`}
                </p>
              </div>
              <Button onClick={handleDelete} className="ml-6" variant="danger">
                Eliminar cuenta
              </Button>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid w-full pt-4 gap-y-4"
            >
              <TextInput
                label="Descripción"
                name="description"
                disabled={false}
                register={register}
                errors={errors.description}
              />
              <FileInput
                label="Foto de perfil"
                name="file"
                disabled={false}
                errors={errors.file}
                {...register("file")}
              />
              <Button type="submit">
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <SpinnerIcon className="w-6 h-6 animate-spin fill-emerald-500" />
                  </div>
                ) : (
                  "Guardar"
                )}
              </Button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
