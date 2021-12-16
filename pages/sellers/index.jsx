import useGetAll from "hooks/useGetAll";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "ui/Button";
import SpinnerIcon from "ui/Icons/SpinnerIcon";

export default function Profile() {
  const router = useRouter();
  const sellers = useGetAll("users");
  console.log(sellers?.data?.users, "gaaaaa");

  return (
    <div className="w-full ">
      <h1 className="pt-4 pl-4 text-2xl font-bold">Vendedores</h1>
      <div className="flex flex-col items-center justify-center w-full py-6 my-4">
        {!sellers ? (
          <SpinnerIcon className="w-10 h-10 mr-3 -ml-1 text-blue-500 animate-spin" />
        ) : (
          sellers?.data?.users.map((seller) => (
            <div
              key={seller.userId}
              className="flex items-center justify-between w-full p-4 transition bg-white hover:bg-slate-100"
            >
              <div className="flex group">
                <div>
                  <Image
                    className="rounded-full"
                    src={seller.profileImage}
                    width={70}
                    height={70}
                    alt={`Foto de perfil de ${seller.name}`}
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{seller.name}</h2>
                  <p className="text-sm">@{seller.email.split("@")[0]}</p>
                </div>
              </div>
              <div>
                <Button
                  onClick={() => {
                    router.push(`/profile/${seller.userId}`);
                  }}
                  className="h-max"
                >
                  {seller.userId !==
                  JSON.parse(window.localStorage.getItem("user"))?.userId
                    ? "Ver perfil"
                    : "Mi perfil"}
                </Button>
                {seller.userId !==
                  JSON.parse(window.localStorage.getItem("user"))?.userId && (
                  <Button variant="tertiary" className="ml-6 h-max">
                    Seguir
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
