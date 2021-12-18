import Image from "next/image";
import { useEffect } from "react";
import NextLink from "next/link";
import Link from "ui/Link";
import { useState } from "react";
import CommentaryIcon from "ui/Icons/CommentaryIcon";
import { useReload } from "context/reloadContext";

export default function Products() {
  const [publications, setPublications] = useState(null);
  const [authors, setAuthors] = useState(null);
  const { reload } = useReload();

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const responsePublications = await fetch(
          `${process.env.NEXT_PUBLIC_KISARAGI_PRODUCTS_API}/products?from=0&limit=19`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await responsePublications.json();
        console.log(data, "publi");
        // order by createtAt
        setPublications(
          data.products.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
        );
        const authorsIdArray = data.products
          .map((publication) => publication.ownerId)
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
      <h1 className="pt-4 pl-4 text-2xl font-bold">Productos</h1>
      {/* 
      [
    {
        "id": 5,
        "name": "Product 5",
        "ownerId": "61baa0b92f1064030b358434",
        "price": 50,
        "quantity": 50,
        "available": true,
        "image": "https://picsum.photos/200/300",
        "createdAt": "2021-12-17T07:28:47.990Z",
        "updatedAt": "2021-12-17T07:28:47.990Z",
        "productInformation": {
            "id": 5,
            "brand": "Brand 5",
            "series": "Series 5",
            "country": "Country 5",
            "description": "Description 5",
            "createdAt": "2021-12-17T07:28:48.105Z",
            "updatedAt": "2021-12-17T07:28:48.105Z",
            "product_id": 5
        }
    },
    {
        "id": 4,
        "name": "Product 4",
        "ownerId": "61baa0b92f1064030b358434",
        "price": 40,
        "quantity": 40,
        "available": true,
        "image": "https://picsum.photos/200/300",
        "createdAt": "2021-12-17T07:28:47.990Z",
        "updatedAt": "2021-12-17T07:28:47.990Z",
        "productInformation": {
            "id": 4,
            "brand": "Brand 4",
            "series": "Series 4",
            "country": "Country 4",
            "description": "Description 4",
            "createdAt": "2021-12-17T07:28:48.105Z",
            "updatedAt": "2021-12-17T07:28:48.105Z",
            "product_id": 4
        }
    },
    {
        "id": 3,
        "name": "Product 3",
        "ownerId": "61baa0b92f1064030b358434",
        "price": 30,
        "quantity": 30,
        "available": true,
        "image": "https://picsum.photos/200/300",
        "createdAt": "2021-12-17T07:28:47.990Z",
        "updatedAt": "2021-12-17T07:28:47.990Z",
        "productInformation": {
            "id": 3,
            "brand": "Brand 3",
            "series": "Series 3",
            "country": "Country 3",
            "description": "Description 3",
            "createdAt": "2021-12-17T07:28:48.105Z",
            "updatedAt": "2021-12-17T07:28:48.105Z",
            "product_id": 3
        }
    },
    {
        "id": 2,
        "name": "Product 2",
        "ownerId": "61baa0b92f1064030b358434",
        "price": 20,
        "quantity": 20,
        "available": true,
        "image": "https://picsum.photos/200/300",
        "createdAt": "2021-12-17T07:28:47.990Z",
        "updatedAt": "2021-12-17T07:28:47.990Z",
        "productInformation": {
            "id": 2,
            "brand": "Brand 2",
            "series": "Series 2",
            "country": "Country 2",
            "description": "Description 2",
            "createdAt": "2021-12-17T07:28:48.105Z",
            "updatedAt": "2021-12-17T07:28:48.105Z",
            "product_id": 2
        }
    },
    {
        "id": 1,
        "name": "Product 1",
        "ownerId": "61baa0b92f1064030b358434",
        "price": 10,
        "quantity": 10,
        "available": true,
        "image": "https://picsum.photos/200/300",
        "createdAt": "2021-12-17T07:28:47.990Z",
        "updatedAt": "2021-12-17T07:28:47.990Z",
        "productInformation": {
            "id": 1,
            "brand": "Brand 1",
            "series": "Series 1",
            "country": "Country 1",
            "description": "Description 1",
            "createdAt": "2021-12-17T07:28:48.105Z",
            "updatedAt": "2021-12-17T07:28:48.105Z",
            "product_id": 1
        }
    }
]
      */}
      {publications &&
      authors &&
      publications?.length > 0 &&
      authors?.length > 0 ? (
        <div className="flex flex-col w-full py-6 my-4 bg-white cursor-pointer">
          {publications.map((publication) => {
            const currentAuthor = authors?.find(
              (author) => author.user.userId === publication.ownerId
            );
            return (
              <NextLink
                key={publication.id}
                href={`/products/${publication.id}`}
              >
                <a className="flex px-6 py-4 hover:bg-slate-100">
                  <div className="w-12">
                    {currentAuthor?.user?.profileImage && (
                      <Image
                        className="rounded-full"
                        src={currentAuthor?.user?.profileImage}
                        alt={`Foto de perfil de ${publication.title}`}
                        width={48}
                        height={48}
                      />
                    )}
                  </div>
                  <div className="w-1/3 ">
                    <div className="flex items-center mt-2 ml-4">
                      <span className="font-bold">
                        {currentAuthor?.user?.name}
                      </span>
                      <span className="ml-1 font-medium text-gray-600 ">
                        @{currentAuthor?.user?.email.split("@")[0]}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        {getTimeAge(publication.createdAt)}
                      </span>
                    </div>
                    <div className="relative w-full my-4 ml-4 overflow-hidden bg-gray-800 rounded-lg aspect-video">
                      <Image
                        src={publication.image}
                        alt={`Imagen de ${publication.name}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-2/5 px-6 py-4 mt-10 ml-10 bg-blue-100 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <span className="flex text-lg font-semibold">
                        {publication.name}
                      </span>
                    </div>
                    <div className="flex justify-between w-full mt-2">
                      <span className="font-semibold text-gray-600">
                        Descripción:
                      </span>
                      <span className="ml-8 text-gray-600 max-w-prose">
                        {publication.productInformation.description}
                      </span>
                    </div>

                    <div className="flex justify-between w-full mt-2">
                      <span className="font-semibold text-gray-600">
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
                      <span className="font-semibold text-gray-600">País:</span>
                      <span className="text-gray-600 max-w-prose">
                        {publication.productInformation.country}
                      </span>
                    </div>
                    <div className="flex items-center mt-10">
                      <span className="flex mr-2 text-base">Comentarios</span>
                      <CommentaryIcon className="w-5 h-5 mr-2 fill-slate-600" />
                      <span>{publication.commentary?.length}</span>
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
