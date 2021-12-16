import Image from "next/image";
import { useEffect } from "react/cjs/react.development";
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

const schema = yup.object().shape({
  commentary: yup.string().required("Comment is required"),
});

export default function PublicationDetails({ user }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { publicationId } = router.query;
  console.log(user, "GAA");
  const [publication, setPublications] = useState(null);
  const [author, setAuthor] = useState(null);
  const [commentariesAuthors, setCommentariesAuthors] = useState(null);
  const handleDeleteCommentary = useDelete("commentaries");
  const handleDeletePublication = useDelete("publications");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (publicationId) {
      const fetchPublications = async () => {
        try {
          const responsePublications = await fetch(
            `${process.env.NEXT_PUBLIC_KISARAGI_PUBLICATIONS_API}/publications/${publicationId}/id`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const publicationParsed = await responsePublications.json();
          setPublications(publicationParsed);
          console.log(publicationParsed, "one publication");
          const { author_id } = publicationParsed;
          const responseAuthor = await fetch(
            `${process.env.NEXT_PUBLIC_KISARAGI_USERS_API}/users/${author_id}`,
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

          const arrayPromises = publicationParsed.commentaries.map(
            async (commentary) => {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_KISARAGI_USERS_API}/users/${commentary.author_id}`,
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
  }, [reload, publicationId]);

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
    formData.append("publication_id", publicationId);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KISARAGI_PUBLICATIONS_API}/commentaries`,
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
            <div className="flex w-full">
              <div className="w-12">
                <Image
                  className="rounded-full"
                  src={author?.user?.profileImage}
                  alt={`Foto de perfil de ${author.name}`}
                  width={48}
                  height={48}
                />
              </div>
              <div className="flex flex-col flex-1 ml-3">
                <div className="flex items-center justify-between w-4/6">
                  <span className="flex text-lg font-semibold">
                    {publication.title}
                  </span>
                  {
                    // If user is the author of the publication, show the delete button
                    author?.user?.userId ===
                      JSON.parse(window.localStorage.getItem("user")).id && (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => {
                            handleDeletePublication(publication.publication_id);
                            router.push("/app");
                          }}
                          variant="danger"
                        >
                          Eliminar publicación
                        </Button>
                      </div>
                    )
                  }
                </div>
                <span className="text-sm text-gray-600 max-w-prose">
                  {publication.content.split(" ").map((item, index) => {
                    if (item.startsWith("#")) {
                      return (
                        <Link
                          key={index}
                          to={`/publication/hashtags?hashtag=${item.slice(1)}`}
                        >
                          {" "}
                          <a className="text-blue-600">{item}</a>
                        </Link>
                      );
                    } else {
                      return " " + item;
                    }
                  })}
                </span>
                <div className="relative w-2/4 my-4 overflow-hidden bg-gray-800 rounded-lg aspect-video">
                  <Image
                    src={publication.img_url}
                    alt={`Imagen de ${publication.title}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {/* Change to long date format */}
                  {new Date(publication.created_at).getDate()} de{" "}
                  {new Date(publication.created_at).toLocaleString("es-ES", {
                    month: "short",
                  })}{" "}
                  {new Date(publication.created_at).getFullYear()}
                </span>
                <div className="flex items-center mt-4">
                  <CommentaryIcon className="w-5 h-5 mr-2 fill-slate-600" />
                  <span>{publication.commentaries?.length}</span>
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
              {publication.commentaries?.map((commentary) => {
                const author = commentariesAuthors.find(
                  (author) => author.user.userId === commentary.author_id
                );
                return (
                  <div
                    key={commentary.commentary_id}
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
                            {getTimeAge(publication.created_at)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 max-w-prose">
                          {commentary.commentary}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {commentary.author_id === user.userId && (
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
              {publication?.commentaries.length === 0 && (
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
