import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import CommentaryIcon from "ui/Icons/CommentaryIcon";
import { useRouter } from "next/router";
import TextInput from "ui/TextInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "ui/Button";
import useDelete from "hooks/useDelete";
import Link from "ui/Link";
import { useReload } from "context/reloadContext";

const schema = yup.object().shape({
  commentary: yup.string().required("Comment is required"),
});

export default function PublicationDetails() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { reloadPage } = useReload();
  const { productId } = router.query;
  const [publication, setPublications] = useState(null);
  const [author, setAuthor] = useState(null);
  const [commentariesAuthors, setCommentariesAuthors] = useState(null);
  const handleDeleteCommentary = useDelete("commentariesProd");
  const handleDeletePublication = useDelete("publications");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
    if (productId) {
      const fetchPublications = async () => {
        try {
          const responsePublications = await fetch(
            `${process.env.NEXT_PUBLIC_KISARAGI_PRODUCTS_API}/products/${productId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const publicationParsed = await responsePublications.json();
          console.log(publicationParsed, "one publication");
          const { user } = publicationParsed;
          setPublications(user);
          const responseAuthor = await fetch(
            `${process.env.NEXT_PUBLIC_KISARAGI_USERS_API}/users/${user.ownerId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const authorParsed = await responseAuthor.json();
          console.log(authorParsed, "author");
          setAuthor(authorParsed);

          const arrayPromises = publicationParsed.user.commentary.map(
            async (commentary) => {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_KISARAGI_USERS_API}/users/${commentary.authorId}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                const data = await response.json();
                return data;
              } catch (error) {
                console.error(error);
              }
            }
          );
          const responseAuthors = await Promise.all(arrayPromises);
          console.log(responseAuthors, "commentaries authors");
          setCommentariesAuthors(responseAuthors);
        } catch (error) {
          console.error(error);
        }
      };
      const token = window.localStorage.getItem("token");

      if (token) {
        fetchPublications();
      }
    }
  }, [reload, productId]);

  const getTimeAge = (date) => {
    const now = new Date();
    const createdAt = new Date(date);
    const diff = now - createdAt;
    const diffSeconds = Math.floor(diff / 1000);
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffSeconds < 60) {
      return `${diffSeconds} segundos`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return `${diffDays}d`;
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("commentary", data.commentary);
    formData.append("product_id", productId);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KISARAGI_PRODUCTS_API}/commentaries`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("token")
          )}`,
        },
        body: formData,
      }
    );
    const parsed = await res.json();
    console.log(parsed);
    setReload(!reload);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="pt-4 pl-4 text-2xl font-bold">Publicación</h1>
      {/* 
        publications: array of objects
        object schema:
        {
    "publication_id": "61b9a29a59de34b2bc92f7d5",
    "title": "Kumiko Oumae",
    "content": "Protagonista de Hibike Euphonium, anime ambientado en la banda escolar de la preparatoria Kitauji",
    "author_id": "61b91ac87fa6c2abb77c5db4",
    "img_url": "http://res.cloudinary.com/ab-software/image/upload/v1639555737/jh30bjvzj8pof8vp9dv3.jpg",
    "commentaries": [
        {
            "commentary_id": "61b9a2ba3373b73a2286a4d8",
            "author_id": "61b91ac87fa6c2abb77c5db4",
            "commentary": "Un gran anime, valga decir",
            "created_at": "2021-12-15"
        }
    ],
    "created_at": "2021-12-15"
}
      */}
      {publication && author && commentariesAuthors ? (
        <div className="flex flex-col w-full py-6 my-4 bg-white">
          <div className="flex flex-col px-6 py-4">
            <div className="flex flex-col w-full">
              <div className="flex w-full">
                <div className="w-12">
                  <Image
                    className="rounded-full"
                    src={author?.user?.profileImage}
                    alt={`Foto de perfil de ${author?.user.name}`}
                    width={48}
                    height={48}
                  />
                </div>
                <div className="flex items-center ml-4">
                  <span className="font-bold">{author?.user?.name}</span>
                  <span className="ml-1 font-medium text-gray-600 ">
                    @{author?.user?.email.split("@")[0]}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    {getTimeAge(publication.createdAt)}
                  </span>
                </div>
                {
                  // If user is the author of the publication, show the delete button
                  author?.user?.userId ===
                    JSON.parse(window.localStorage.getItem("user"))?.userId && (
                    <div className="flex items-center justify-between w-4/6 ml-24">
                      <div className="flex justify-end">
                        <Button
                          onClick={async () => {
                            await handleDeletePublication(
                              publication.publication_id
                            );
                            reloadPage();
                            router.push("/app");
                            setReload(!reload);
                          }}
                          variant="danger"
                        >
                          Eliminar publicación
                        </Button>
                      </div>
                    </div>
                  )
                }
              </div>
              <div className="flex flex-col flex-1 ml-3">
                <div className="flex w-full">
                  <div className="relative w-2/4 my-4 overflow-hidden bg-gray-800 rounded-lg aspect-video">
                    <Image
                      src={publication.image}
                      alt={`Imagen de ${publication.name}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <span className="flex flex-col w-1/3 px-6 py-4 mt-4 ml-10 rounded-lg shadow-md bg-emerald-100">
                    <div className="flex flex-col flex-1 mt-4">
                      <div className="flex items-center">
                        <span className="flex text-lg font-semibold">
                          {publication.name}
                        </span>
                      </div>
                      <div className="flex justify-between w-full mt-2">
                        <span className="font-semibold text-gray-600 ">
                          Descripción:
                        </span>
                        <span className="ml-8 text-gray-600 max-w-prose">
                          {publication.productInformation.description}
                        </span>
                      </div>

                      <div className="flex justify-between mt-2 full">
                        <span className="text-sm font-semibold text-gray-600">
                          Marca:
                        </span>
                        <span className="text-gray-600 max-w-prose">
                          {publication.productInformation.brand}
                        </span>
                      </div>

                      <div className="flex justify-between w-full mt-2">
                        <span className="font-semibold text-gray-600">
                          Serie:
                        </span>
                        <span className="text-gray-600 max-w-prose">
                          {publication.productInformation.series}
                        </span>
                      </div>

                      <div className="flex justify-between w-full mt-2">
                        <span className="font-semibold text-gray-600">
                          País:
                        </span>
                        <span className="text-gray-600 max-w-prose">
                          {publication.productInformation.country}
                        </span>
                      </div>
                    </div>
                  </span>
                </div>
                <div>
                  <span className="ml-2 text-sm text-gray-600">
                    {/* Change to long date format */}
                    {new Date(publication.createdAt).getDate()} de{" "}
                    {new Date(publication.createdAt).toLocaleString("es-ES", {
                      month: "short",
                    })}{" "}
                    {new Date(publication.createdAt).getFullYear()}
                  </span>
                  <div className="flex items-center mt-4">
                    <span className="flex mr-2 text-base">Comentarios</span>
                    <CommentaryIcon className="w-5 h-5 mr-2 fill-slate-600" />
                    <span>{publication.commentaries?.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <form className="w-3/5" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-end justify-end">
                <div className="w-12">
                  <Image
                    className="rounded-full"
                    src={user.profileImage}
                    alt={`Foto de perfil de ${author.name}`}
                    width={48}
                    height={48}
                  />
                </div>
                <TextInput
                  label="Comentario"
                  name="commentary"
                  register={register}
                  errors={errors.commentary}
                />
                <Button type="submit" disabled={isSubmitting}>
                  Comentar
                </Button>
              </div>
            </form>
            <div>
              {publication.commentary?.map((commentary) => {
                const author = commentariesAuthors.find(
                  (author) => author?.user?.userId === commentary?.authorId
                );
                console.log(author, "ptmr");
                return (
                  <div
                    key={commentary.id}
                    className="flex flex-col w-full px-6 py-4 mt-4"
                  >
                    <div className="flex w-3/5">
                      <div className="w-12">
                        {author?.user?.profileImage && (
                          <Image
                            className="rounded-full"
                            src={author?.user?.profileImage}
                            alt={`Foto de perfil de ${author?.user?.name}`}
                            width={48}
                            height={48}
                          />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 ml-3">
                        <div className="flex items-center">
                          <span className="flex text-lg font-semibold">
                            {author?.user?.name}
                          </span>
                          <span className="ml-2 text-sm text-gray-600">
                            {getTimeAge(publication.createdAt)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 max-w-prose">
                          {commentary.commentary}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {commentary.authorId === user.userId && (
                          <Button
                            onClick={async () => {
                              const newFormData = new FormData();
                              newFormData.append(
                                "publication_id",
                                publication.publication_id
                              );
                              await handleDeleteCommentary(
                                commentary.commentary_id,
                                newFormData
                              );
                              setReload(!reload);
                            }}
                            variant="danger"
                            type="button"
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {publication?.commentary.length === 0 && (
                <div className="flex flex-col w-full px-6 py-4 mt-4">
                  <span className="text-sm text-gray-600">
                    No hay comentarios aún
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
