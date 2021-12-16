import useGetOne from "hooks/useGetOne";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "ui/Button";
import SpinnerIcon from "ui/Icons/SpinnerIcon";

export default function Profile() {
  const router = useRouter();
  const { userId } = router.query;
  const currentUser = useGetOne("users", userId);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);

  useEffect(() => {
    const parsedUser = JSON.parse(window.localStorage.getItem("user"));
    if (currentUser && userId) {
      setIsCurrentUserProfile(
        currentUser?.data?.user?.userId === parsedUser?.userId
      );
    }
  }, [currentUser, userId]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex justify-center w-full">
        {!currentUser?.data || !userId ? (
          <SpinnerIcon className="w-10 h-10 mr-3 -ml-1 text-blue-500 animate-spin" />
        ) : (
          <section className="flex flex-col items-center justify-center flex-1 max-w-lg px-4 py-8 bg-white shadow-lg">
            <h1 className="mb-4 text-2xl font-bold">
              {isCurrentUserProfile
                ? "Tu perfil"
                : `Perfil de ${currentUser?.data?.user?.name}`}
            </h1>
            <div className="flex items-center justify-center w-full my-4">
              <Image
                className="rounded-full"
                src={currentUser?.data?.user?.profileImage}
                alt={`Foto de perfil de ${currentUser?.data?.user?.name}`}
                width={200}
                height={200}
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
            </div>
            {isCurrentUserProfile ? (
              <Button
                onClick={() => {
                  router.push("/profile/edit");
                }}
                variant="tertiary"
                className="w-4/5 mt-4"
              >
                Editar perfil
              </Button>
            ) : (
              <Button variant="tertiary" className="w-4/5 mt-4">
                Seguir
              </Button>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
