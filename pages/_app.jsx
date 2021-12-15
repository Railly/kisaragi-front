import AppLayout from "components/AppLayout";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { user, refetchUser } = useUser();
  return (
    <>
      {router.pathname.split("/").includes("app") ||
      router.pathname.split("/").includes("profile") ||
      router.pathname.split("/").includes("sellers") ? (
        <AppLayout user={user} refetchUser={refetchUser}>
          <Component user={user} {...pageProps} />
        </AppLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
