import useUser from "hooks/useUser";
import Image from "next/image";

export default function App() {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center justify-center max-w-xl px-8 py-6 bg-white shadow-lg">
        {user ? (
          <>
            <p>
              Bienvenido <strong>{user.name}</strong>
            </p>
            <p>
              Tu correo es <strong>{user.email}</strong>
            </p>
            <div>
              <Image
                className="rounded-full"
                src={user.profileImage}
                alt={`Foto de perfil de ${user.name}`}
                width={200}
                height={200}
              />
            </div>
          </>
        ) : (
          <p>No hay usuario logueado</p>
        )}
      </div>
    </div>
  );
}
