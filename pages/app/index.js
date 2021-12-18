import Image from "next/image";
import { useEffect } from "react";
import NextLink from "next/link";
import Link from "ui/Link";
import { useState } from "react";
import CommentaryIcon from "ui/Icons/CommentaryIcon";
import { useReload } from "context/reloadContext";

export default function MainApp() {
  const [publications, setPublications] = useState(null);
  const [authors, setAuthors] = useState(null);
  const { reload } = useReload();

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const responsePublications = await fetch(
          `${process.env.NEXT_PUBLIC_KISARAGI_PUBLICATIONS_API}/publications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await responsePublications.json();
        setPublications(data.reverse());
        const authorsIdArray = data
          .map((publication) => publication.author_id)
          .reduce((acc, authorId) => {
            if (!acc.includes(authorId)) {
              acc.push(authorId);
            }
            return acc;
          }, []);

        const arrayPromises = authorsIdArray.map(async (authorId) => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_KISARAGI_USERS_API}/users/${authorId}`,
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
        });
        const responseAuthors = await Promise.all(arrayPromises);
        setAuthors(responseAuthors);
        console.log(data, "publi");
        console.log(responseAuthors, "author");
      } catch (error) {
        console.error(error);
      }
    };
    const token = window.localStorage.getItem("token");

    if (token) {
      fetchPublications();
    }
  }, [reload]);

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
      return `${diffHours} h`;
    } else {
      return `${diffDays} d`;
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="pt-4 pl-4 text-2xl font-bold">Inicio</h1>
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
      {publications &&
      authors &&
      publications?.length > 0 &&
      authors?.length > 0 ? (
        <div className="flex flex-col w-full py-6 my-4 bg-white cursor-pointer">
          {publications.map((publication) => {
            const currentAuthor = authors?.find(
              (author) => author.user.userId === publication.author_id
            );
            return (
              <NextLink
                key={publication.publication_id}
                href={`/publication/${publication.publication_id}`}
              >
                <a className="flex px-6 py-4 hover:bg-slate-100">
                  <div className="w-12">
                    <Image
                      className="rounded-full"
                      src={currentAuthor?.user?.profileImage}
                      alt={`Foto de perfil de ${publication.title}`}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="flex flex-col flex-1 ml-3">
                    <div className="flex items-center mt-3">
                      <span className="font-bold">
                        {currentAuthor?.user?.name}
                      </span>
                      <span className="ml-1 font-medium text-gray-600 ">
                        @{currentAuthor?.user?.email.split("@")[0]}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        {getTimeAge(publication.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center mt-4">
                      <span className="flex text-lg font-semibold">
                        {publication.title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 max-w-prose">
                      {publication.content.split(" ").map((item, index) => {
                        if (item.startsWith("#")) {
                          return (
                            <Link
                              key={index}
                              to={`/publication/hashtags?hashtag=${item.slice(
                                1
                              )}`}
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
                    <div className="flex items-center mt-2">
                      <span className="flex mr-2 text-base">Comentarios</span>
                      <CommentaryIcon className="w-5 h-5 mr-2 fill-slate-600" />
                      <span>{publication.commentaries?.length}</span>
                    </div>
                  </div>
                </a>
              </NextLink>
            );
          })}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
