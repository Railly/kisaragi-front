import { Dialog, Transition } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "ui/Button";
import FileInput from "ui/FileInput";
import CloseIcon from "ui/Icons/CloseIcon";
import TextAreaInput from "ui/TextAreaInput";
import TextInput from "ui/TextInput";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().required("Título es requerido"),
  content: yup.string().required("Contenido es requerido"),
  file: yup.mixed(),
});

export default function PublishModal() {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const file = watch("file");

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KISARAGI_PUBLICATIONS_API}/publications`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
      }
    );
    const json = await res.json();
    closeModal();
    console.log(json);
    router.push("/app");
  };

  return (
    <>
      <Button
        type="button"
        onClick={openModal}
        variant="secondary"
        className="rounded-full"
      >
        Publicar
      </Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <button
                  type="button"
                  className="fixed top-0 left-0 p-1 mt-3 ml-3 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-full hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={closeModal}
                >
                  <CloseIcon className="w-5 h-5 fill-blue-500" />
                </button>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-center text-gray-900"
                >
                  Publica tu producto
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid mt-2 gap-y-4"
                >
                  <TextInput
                    label="Título"
                    name="title"
                    register={register}
                    errors={errors.title}
                  />
                  <TextAreaInput
                    label="Contenido"
                    name="content"
                    register={register}
                    errors={errors.content}
                  />
                  <FileInput
                    label="Imagen"
                    name="image"
                    errors={errors.file}
                    {...register("file")}
                  />
                  {file?.[0] && (
                    <div className="grid grid-cols-1 gap-y-2">
                      <Image
                        className="rounded-lg"
                        src={URL.createObjectURL(file[0])}
                        width={300}
                        height={300}
                        alt="Imagen de publicación"
                      />
                    </div>
                  )}
                  <Button
                    type="submit"
                    variant="secondary"
                    className="mt-4"
                    disabled={isSubmitting}
                  >
                    Publicar
                  </Button>
                </form>

                <div className="mt-4"></div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
