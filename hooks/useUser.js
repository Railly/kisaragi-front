import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const parsedUser = JSON.parse(window.localStorage.getItem("user"));
    setUser(parsedUser);
  }, [reload]);

  return { user, refetchUser: () => setReload(!reload) };
}
