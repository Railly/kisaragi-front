import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "ui/Button";
import HomeIcon from "ui/Icons/HomeIcon";
import ProfileIcon from "ui/Icons/ProfileIcon";
import SellerIcon from "ui/Icons/SellerIcon";

export default function AppLayout({ user, children }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen text-slate-800">
      <aside className="flex flex-col items-center w-1/5 py-4 border-r shadow-inner bg-blue-50">
        <div className="flex flex-col justify-between w-full h-full">
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
            <Button variant="secondary" className="rounded-full">
              Publicar
            </Button>
          </div>
          <div className="flex items-center justify-center px-2 py-3 mx-8 mb-8 transition rounded-full cursor-pointer hover:bg-slate-200">
            {user && (
              <>
                <Image
                  className="rounded-full"
                  src={user.profileImage}
                  alt={`Foto de perfil de ${user.name}`}
                  width={50}
                  height={50}
                />
                <div className="flex flex-col ml-2">
                  <span className="ml-2 text-lg font-semibold">
                    {user.name}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    {user.email}
                  </span>
                </div>
              </>
            )}
            <div></div>
          </div>
        </div>
      </aside>
      <main className="flex flex-col items-center flex-1 w-screen bg-blue-50">
        {children}
      </main>
    </div>
  );
}
