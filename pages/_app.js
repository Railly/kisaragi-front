import AppLayout from "components/AppLayout";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { user, refetchUser } = useUser();

  return (
    <>
      {router.pathname !== "/login" && router.pathname !== "/" ? (
        <AppLayout user={user} refetchUser={refetchUser}>
          <Component user={user} {...pageProps} />
        </AppLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
