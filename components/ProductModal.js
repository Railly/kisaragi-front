import { Dialog, Transition } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useReload } from "context/reloadContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "ui/Button";
import FileInput from "ui/FileInput";
import CloseIcon from "ui/Icons/CloseIcon";
import TextInput from "ui/TextInput";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Nombre es requerido"),
  price: yup.string().required("Precio es requerido"),
  quantity: yup.string().required("Cantidad es requerido"),
  brand: yup.string().required("Marca es requerido"),
  series: yup.string().required("Serie es requerido"),
  description: yup.string().required("Descripción es requerido"),
  country: yup.string().required("País es requerido"),
  file: yup.mixed(),
});

export default function ProductModal() {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { reloadPage } = useReload();

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
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("quantity", data.quantity);
    formData.append("brand", data.brand);
    formData.append("series", data.series);
    formData.append("description", data.description);
    formData.append("country", data.country);
    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KISARAGI_PRODUCTS_API}/products`,
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
    reloadPage();
    closeModal();
    console.log(json);
    router.push("/products");
  };

  return (
    <>
      <Button
        type="button"
        onClick={openModal}
        variant="tertiary"
        className="rounded-full"
      >
        Nuevo producto
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
                  Comparte tu coleccionable
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid mt-2 gap-y-4"
                >
                  <TextInput
                    label="Nombre"
                    name="name"
                    register={register}
                    errors={errors.name}
                  />
                  <TextInput
                    label="Descripción"
                    name="description"
                    register={register}
                    errors={errors.description}
                  />
                  <TextInput
                    label="Precio (S/.)"
                    name="price"
                    register={register}
                    errors={errors.price}
                  />
                  <TextInput
                    label="Cantidad"
                    name="quantity"
                    register={register}
                    errors={errors.quantity}
                  />
                  <TextInput
                    label="Marca"
                    name="brand"
                    register={register}
                    errors={errors.brand}
                  />
                  <TextInput
                    label="Serie"
                    name="series"
                    register={register}
                    errors={errors.series}
                  />
                  <TextInput
                    label="País"
                    name="country"
                    register={register}
                    errors={errors.country}
                  />
                  <FileInput
                    label="Imagen"
                    name="file"
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
