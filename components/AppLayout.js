import { Popover } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { usePopper } from "react-popper";
import { useEffect } from "react/cjs/react.development";
import HomeIcon from "ui/Icons/HomeIcon";
import ProfileIcon from "ui/Icons/ProfileIcon";
import SellerIcon from "ui/Icons/SellerIcon";
import PublishModal from "./PublishModal";

export default function AppLayout({
  user = {},
  refetchUser = () => {},
  children,
}) {
  const router = useRouter();
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [10, 20],
        },
      },
    ],
  });

  // useEffect(() => {
  //   refetchUser();
  // }, []);

  return (
    <div className="flex text-slate-800">
      <aside className="fixed flex flex-col items-center w-1/5 h-screen py-4 bg-white border-r shadow-inner">
        <div className="z-20 flex flex-col justify-between w-full h-full">
          <div className="grid w-full px-8 gap-y-6">
            <Link href="/app">
              <a className="flex items-center px-4 py-2 transition rounded-full cursor-pointer w-max hover:bg-blue-200">
                <h1 className="text-3xl font-bold text-blue-700">Kisaragi</h1>
              </a>
            </Link>
            <Link href="/app">
              <a className="flex items-center px-4 py-2 transition rounded-full cursor-pointer hover:bg-slate-300">
                <HomeIcon
                  className="w-8 h-8 mr-2 fill-slate-800"
                  filled={router.pathname === "/app"}
                />
                <span
                  className={`text-lg ${
                    router.pathname === "/app" && "font-bold"
                  }`}
                >
                  Inicio
                </span>
              </a>
            </Link>
            <Link
              href={{
                pathname: `${user ? `/profile/[userId]` : "/login"}`,
                query: {
                  userId: user?.userId,
                },
              }}
            >
              <a className="flex items-center px-4 py-2 transition rounded-full cursor-pointer hover:bg-slate-200">
                <ProfileIcon
                  className="w-8 h-8 mr-2 fill-slate-800"
                  filled={router.query.userId === user?.userId}
                />
                <span
                  className={`text-lg ${
                    router.query.userId === user?.userId && "font-bold"
                  }`}
                >
                  Perfil
                </span>
              </a>
            </Link>
            <Link href="/sellers">
              <a className="flex items-center px-4 py-2 transition rounded-full cursor-pointer hover:bg-slate-200">
                <SellerIcon
                  className="w-8 h-8 mr-2 fill-slate-800"
                  filled={router.pathname === "/sellers"}
                />
                <span
                  className={`text-lg ${
                    router.pathname === "/sellers" && "font-bold"
                  }`}
                >
                  Vendedores
                </span>
              </a>
            </Link>
            <PublishModal />
          </div>
          <div>
            <Popover className="relative transition">
              <Popover.Button ref={setReferenceElement}>
                <div className="flex items-center px-8 py-3 mx-4 mb-8 transition rounded-full cursor-pointer hover:bg-slate-200">
                  {user && (
                    <>
                      <Image
                        className="rounded-full"
                        src={user.profileImage}
                        alt={`Foto de perfil de ${user.name}`}
                        width={50}
                        height={50}
                      />
                      <div className="flex-col ml-2">
                        <span className="flex ml-2 text-lg font-semibold">
                          {user.name}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          {user.email}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Popover.Button>
              <Popover.Panel
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
              >
                <div className="flex flex-col justify-center w-full h-full px-8 py-6 bg-white rounded-lg shadow-lg">
                  {user && (
                    <div className="flex">
                      <div>
                        <Image
                          className="rounded-full"
                          src={user.profileImage}
                          alt={`Foto de perfil de ${user.name}`}
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className="flex flex-col ml-2">
                        <span className="ml-2 text-lg font-semibold">
                          {user.name}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      window.localStorage.removeItem("token");
                      window.localStorage.removeItem("user");
                      refetchUser();
                      router.push("/login");
                    }}
                    className="flex items-center px-4 py-2 mt-4 transition rounded-full cursor-pointer hover:bg-slate-200"
                  >
                    <span className="text-lg font-medium">{`Cerrar la sesión de @${
                      user?.email.split("@")[0]
                    }`}</span>
                  </button>
                </div>
              </Popover.Panel>
            </Popover>
          </div>
        </div>
      </aside>
      <div className="w-1/5"></div>
      <main className="flex flex-col items-center flex-1 w-screen h-screen bg-white">
        {children}
      </main>
    </div>
  );
}
